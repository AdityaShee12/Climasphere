import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userService";
import {
  setUserId,
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

  // Sign IN
  const signIn = () => {
    navigate("/sign_in");
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
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("proffesion", proffesion);

    if (avatar) formData.append("avatar", avatar);
    try {
      const response = await registerUser(formData);
      console.log(response);
      dispatch(setUserId({ userId: response.data._id }));
      dispatch(setUserName({ userName: response.data.userName }));
      dispatch(setUserAvatar({ userAvatar: response.data.avatar }));
      dispatch(setUserAbout({ userAbout: response.data.about }));
      navigate("/layout");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="font-mono text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] xl:text-[3rem] py-12">
        ChatBook
      </div>

      <div className="w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[30rem] xl:w-[30vw] border border-slate-400 rounded-md flex flex-col items-center p-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-slate-400 rounded-xl px-3 py-2 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl mb-6"
        />
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-slate-400 rounded-xl px-3 py-2 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl mb-6"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-slate-400 rounded-xl px-3 py-2 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl mb-6"
        />
        <button
          onClick={chooseAvatar}
          className="border border-slate-400 rounded-xl font-semibold w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl h-[3rem] sm:h-[3.5rem] mb-8 transition duration-300 hover:shadow-lg hover:shadow-sky-400">
          Next
        </button>
      </div>

      {profilepic && (
        <div className="w-[85vw] sm:w-[70vw] md:w-[34rem] lg:w-[30rem] xl:w-[26rem] border border-slate-400 rounded-xl flex flex-col items-center p-6 mt-6">
          <label className="cursor-pointer">
            <div className="bg-slate-300 w-[10rem] h-[10rem] rounded-full flex justify-center items-center mb-4">
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Profile"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div>Upload profile pic</div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="hidden"
            />
          </label>
          <textarea
            value={about}
            onChange={(e) => setProffesion(e.target.value)}
            placeholder="Write something about yourself..."
            className="border border-slate-400 rounded-xl px-3 py-2 w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl mb-6"
          />
          <button
            onClick={handleRegister}
            className="border border-slate-400 rounded-xl font-semibold w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[20rem] xl:w-[25vw] text-lg sm:text-xl md:text-2xl h-[3rem] sm:h-[3.5rem] transition duration-300 hover:shadow-lg hover:shadow-sky-400">
            Next
          </button>
        </div>
      )}

      <p className="text-center text-gray-600 m-7 border border-slate-400 rounded-md p-4 w-[85vw] sm:w-[70vw] md:w-[34rem] lg:w-[30rem] xl:w-[26rem] text-lg sm:text-xl md:text-2xl lg:text-[1.4rem] xl:text-[1rem]">
        Already have an account?{" "}
        <span
          className="text-blue-500 hover:text-blue-600 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
          onClick={signIn}>
          Login here
        </span>
      </p>
    </div>
  );
};
export default Sign_up;
