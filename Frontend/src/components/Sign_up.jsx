import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import {
  setUserFullName,
  setUserName,
  setUserAvatar,
  setUserProffesion,
} from "../features/userSlice";
import { useDispatch } from "react-redux";
import { API } from "../BackendApi";

const Sign_up = () => {
  const [profilepic, setProfilepic] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verifyOtp, setVerifyOtp] = useState("");
  const [otpSent, setOtpSent] = useState(true);
  const [registeremail, setregisterEmail] = useState("");
  const [otpVerified, setotpVerified] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [proffesion, setProffesion] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState("");

  // Sign IN
  const signIn = () => {
    navigate("/sign_in");
  };

  // send OTP
  const sendOtp = async () => {
    try {
      console.log("Back", API, email);
      const response = await axios.post(`${API}/api/weather/otp`, {
        email,
      });
      console.log(response);
      console.log(response.data.data.email);
      console.log(response.data.data.otp);
      setVerifyOtp(response.data.data.otp);
      setregisterEmail(response.data.data.email);
      setOtpSent(false);
      setotpVerified(true);
    } catch (error) {
      console.error("Try again", error);
    }
  };

  // Verify OTP
  const verify = () => {
    console.log(otp, verifyOtp);

    if (otp === verifyOtp) {
      console.log("V", registeremail);
      setotpVerified(false);
      setCreateAccount(true);
    } else {
      console.log("You gave the wrong OTP");
    }
  };

  // Choose Avatar
  const chooseAvatar = () => {
    const regex = /^[a-z0-9._]+$/;
    if (!regex.test(userName)) {
      alert(
        "Username must contain only lowercase letters, numbers, dot, underscore."
      );
    } else {
      setCreateAccount(false);
      setProfilepic(true);
    }
  };

  // Handling registration
  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    console.log(userName, email, password, proffesion, fullName);

    formData.append("fullName", fullName);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("proffesion", proffesion);

    if (avatar) formData.append("avatar", avatar);
    try {
      const response = await registerUser(formData);
      if (response) {
        console.log("Response", response);
        dispatch(setUserName({ userName: response.data.userName }));
        dispatch(setUserFullName({ fullName: response.data.fullName }));
        dispatch(setUserAvatar({ avatar: response.data.avatar }));
        dispatch(
          setUserProffesion({ userProffesion: response.data.proffesion })
        );
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="border border-slate-400 rounded-md h-[35rem] w-[26rem] flex flex-col items-center bg-white mt-[3rem] p-[2rem]">
        <img src="" alt="" className="w-[18rem]" />{" "}
        <div className="text-lg text-center font-serif text-slate-500 mb-[1rem]">
          Sign up to download weather and pollution data and see enviromental
          vlogs
        </div>
        <div className="w-[80vw] sm:w-[70vw] md:w-[50vw] lg:w-[30rem] xl:w-[30vw] flex flex-col items-center ">
          {/* OTP sent */}
          {otpSent && (
            <>
              <button className="bg-[#4337e6] text-white text-lg w-[23rem] h-[2.8rem] rounded-xl my-6 flex items-center justify-center gap-3">
                <img
                  src="/googleIcon.jpg"
                  alt="Google Icon"
                  className="w-6 h-6"
                />
                <span>Login with Google</span>
              </button>

              <div className="relative group flex justify-center">
                {" "}
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-[0.2rem] py-[0.3rem]  sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl outline-none appearance-none pl-[0.5rem]"
                />
                <div className="absolute w-[23rem] h-[0.1rem] rounded-xl bg-[#4337e6] top-[2.5rem] group-hover:h-[0.25rem]"></div>
              </div>
              <button
                onClick={sendOtp}
                className="bg-[#4337e6] text-white text-lg w-[23rem] h-[2.8rem] rounded-xl my-6 flex items-center justify-center gap-3">
                Send OTP
              </button>
            </>
          )}

          {otpVerified && (
            <>
              <div className="relative group">
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter your OTP"
                  className="w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl my-6 outline-none appearance-none pl-[0.5rem]"
                />
                <div className="absolute w-[22.6rem] h-[0.1rem] rounded-xl bg-[#4337e6] top-[3.5rem] group-hover:h-[0.25rem] right-[0.81rem]"></div>
              </div>
              <button
                onClick={verify}
                className="bg-[#4337e6] text-white text-lg w-[23rem] h-[2.8rem] rounded-xl my-6 flex items-center justify-center gap-3">
                Verify your OTP
              </button>
            </>
          )}

          {createAccount && (
            <>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl my-6 outline-none appearance-none"
                />
                <div className="absolute w-[23.8rem] h-[0.1rem] rounded-xl bg-[#4337e6] top-[3.5rem] group-hover:h-[0.25rem]"></div>
              </div>{" "}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  className="-3 py-2 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl mb-6 outline-none appearance-none"
                />
                <div className="absolute w-[23.8rem] h-[0.1rem] rounded-xl bg-[#4337e6] top-[2.5rem] group-hover:h-[0.25rem]"></div>
              </div>
              <div className="relative mt-[0.5rem] group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl mb-6 outline-none appearance-none"
                />{" "}
                <div className="absolute w-[23.8rem] h-[0.1rem] rounded-xl bg-[#4337e6] top-[2rem] group-hover:h-[0.25rem]"></div>
              </div>
              <button
                onClick={chooseAvatar}
                className="bg-[#4337e6] text-white text-lg w-[23rem] h-[2.8rem] rounded-xl my-6 flex items-center justify-center gap-3">
                {" "}
                Next
              </button>
            </>
          )}
        </div>
        {profilepic && (
          <div className="w-[85vw] sm:w-[70vw] md:w-[34rem] lg:w-[30rem] xl:w-[26rem] flex flex-col items-center">
            <label className="cursor-pointer">
              <div className="bg-slate-300 h-[10rem] rounded-full flex justify-center items-center mb-4">
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="Profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <img
                    src="/profileIcon.png"
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full bg-slate-100"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="hidden"
              />
            </label>
            <div className="relative group">
              <input
                value={proffesion}
                onChange={(e) => setProffesion(e.target.value)}
                placeholder="What is your proffesion?"
                className="px-3 py-2 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl mb-6 outline-none appearance-none"
              />
              <div className="absolute w-[23.8rem] h-[0.1rem] rounded-xl bg-[#4337e6] top-[2.5rem] left-[0.5rem] group-hover:h-[0.25rem]"></div>
            </div>{" "}
            <button
              onClick={handleRegister}
              className="bg-[#4337e6] text-white text-lg sm:text-xl md:text-2xl rounded-xl w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] h-[3rem] sm:h-[3.5rem] my-2 duration-300 active:scale-95 hover:shadow-lg">
              Next
            </button>
          </div>
        )}
      </div>
      <p className="text-center text-gray-600 m-7 border border-slate-400 rounded-md p-4 w-[85vw] sm:w-[70vw] md:w-[34rem] lg:w-[25rem] xl:w-[26rem] text-lg sm:text-xl md:text-2xl lg:text-[1.4rem] xl:text-[1rem]">
        Already have an account?{" "}
        <span className="text-[#4337e6] cursor-pointer" onClick={signIn}>
          Login here
        </span>
      </p>
    </div>
  );
};
export default Sign_up;
