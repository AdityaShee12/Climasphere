import { transporter } from "../sendOTP.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Message } from "../models/Message.models.js"
import { Otp } from "../models/Otp.models.js";

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
  if (!email) return res.status(400).json({ message: "Email is required!" });
  const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();
  const otp = generateOTP();
  
  const mailOptions = {
    from: `"LetterBee" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}.`,
  };
  try {
    transporter.sendMail(mailOptions);
    const OTP = await Otp.create({
      OTP: otp,
      email: email
    })
    const responseData = {
      id: OTP._id,
    };
    return res
      .status(201)
      .json(new ApiResponse(200, responseData, "Send otp successfully"));
  } catch (error) {
    console.log(error);
  }
});

const verifyOtp = asyncHandler(async (req, res) => {

  const { id, otp } = req.body;
  const Id = await Otp.findById(id);
  let verified;

  if (Id.OTP === otp) {
    verified = 1;
  } else {
    verified = 0;
  }
  return res
    .status(201)
    .json(new ApiResponse(200, verified, "User registered Successfully"));
})

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
  // if (!isPasswordValid) {
  //   throw new ApiError(401, "Invalid user credentials");
  // }
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

const setPassword = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  user.password = password; // plain password
  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        fullName: user.fullName,
        avatar: user.avatar,
        userName: user.userName,
        about: user.about,
      },
      "Password was changed successfully",
    ),
  );
});

// It is handle fetching users those names are metch with searching query
const searchUser = asyncHandler(async (req, res) => {
  try {
    const { query, userId } = req.query;
    if (!query) return res.json([]);
    const users = await User.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: userId },
    });
    console.log("USERS", users);

    let userData = [];

    if (users.length > 0) {
      console.log("WORK1");
      let userIds = users.map((user) => user._id);
      console.log("WORK2");
      const chatRooms = await Message.find({
        "users.id": userId,
        "users.id": { $in: userIds },
        "messages.0": { $exists: true },
      }).sort({ "messages.timestamp": 1 }).catch(err => {
        console.error("Message.find error:", err);
        throw err;
      });
      console.log("Chatrooms", chatRooms);

      let processedUserIds = new Set();

      chatRooms.forEach((chat) => {
        chat.users.forEach((user) => {
          if (
            user.id.toString() !== userId &&
            !processedUserIds.has(user.id.toString())
          ) {
            processedUserIds.add(user.id.toString());

            const lastMessage = chat.messages[chat.messages.length - 1];
            userData.push({
              _id: user.id,
              fullName: user.fullName,
              avatar: user.avatar || "",
              lastMessage: {
                text: lastMessage?.text || null,
                file: lastMessage?.file || null,
                timestamp: lastMessage?.timestamp || null,
              },
            });
          }
        });
      });
      users.forEach((user) => {
        if (!processedUserIds.has(user._id.toString())) {
          userData.push({
            _id: user._id,
            fullName: user.fullName,
            avatar: user.avatar || "",
          });
        }
      });
    }
    console.log("Users", userData);
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// It is fetch all previous users those was chatting with user
const userList = asyncHandler(async (req, res) => {
  try {
    console.log("DING");

    const { userId } = req.query;
    console.log("ui", userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const chatRooms = await Message.find({
      "users.id": userId,
      "messages.0": { $exists: true },
    }).sort({ "messages.timestamp": -1 });
    let userData = [];
    if (chatRooms.length > 0) {
      chatRooms.forEach((chat) => {
        chat.users.forEach((user) => {
          if (user.id.toString() !== userId) {
            const lastMessage = chat.messages[chat.messages.length - 1];
            let chatter;
            if (user.id === lastMessage.sender.id) {
              chatter = "reciever";
            } else {
              chatter = "sender";
            }
            userData.push({
              _id: user.id,
              fullName: user.name,
              avatar: user.avatar || "",
              lastMessage: {
                text: lastMessage?.text || null,
                file: lastMessage?.file || null,
                chatter,
                timestamp: lastMessage?.timestamp || null,
              },
            });
          }
        });
      });
    }
    console.log("UD", userData);

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const friends = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  console.log("GROU");

  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User ID is required"));
  }

  const user = await User.findById(userId).select("otherUsers");

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  // Filter only friends and map required fields

  const friendsList = (user.otherUsers || [])
    .filter((friend) => friend.relation === "friend")
    .map((friend) => ({
      id: friend.id,
      fullName: friend.fullName,
      avatar: friend.avatar,
      about: friend.about,
    }));
  console.log("friend", friendsList);

  return res
    .status(200)
    .json(new ApiResponse(200, friendsList, "Friends retrieved successfully"));
});

export { sendOtp, verifyOtp, registerUser, loginUser, logoutUser, refreshAccessToken, setPassword, searchUser, userList, friends };
