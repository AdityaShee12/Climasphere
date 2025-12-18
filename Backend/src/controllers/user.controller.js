import { transporter } from "../sendOTP.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("Emails", email);

  if (!email) return res.status(400).json({ message: "Email is required!" });
  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();
  const otp = generateOTP();
  const mailOptions = {
    from: `"Chat Book" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}.`,
  };
  console.log("Work1");
  try {
    transporter.sendMail(mailOptions);
    console.log("Work2");
    const responseData = {
      message: `OTP sent successfully to ${email}`,
      otp,
      email,
    };
    console.log("✅ Response Data:", responseData); // Debugging
    return res
      .status(201)
      .json(new ApiResponse(200, responseData, "Send otp successfully"));
  } catch (error) {
    console.log(error);
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, proffesion, fullName } = req.body;
  console.log("UserName", userName, email, proffesion, password);

  if (
    [fullName, userName, email, password, proffesion].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (typeof fullName !== "string") {
    throw new ApiError(400, "fullName must be a string");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("Avatar", avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("AvatarURL", avatar);

  const user = await User.create({
    userName: userName.toLowerCase(),
    fullName,
    email,
    proffesion,
    password,
    avatar: avatar?.url || "",
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;
  if (!userName && !email) {
    throw new ApiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  if (!accessToken || !refreshAccessToken)
    throw new ApiError(400, "Accesstoken and refreshtoken did'nt generate");
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ message: "userName is required" });
  }

  // Refresh token field remove
  const updatedUser = await User.findOneAndUpdate(
    { userName: userName.toLowerCase() },
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // Clear cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (incomingRefreshToken) console.log(incomingRefreshToken);
  else throw new ApiError("Did not find refreshtoken ");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { sendOtp, registerUser, loginUser, logoutUser, refreshAccessToken };
