import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/user.service.jsx";
import {
  setUserId,
  setUserName,
  setUserAvatar,
  setUserAbout,
} from "../features/userSlice";
import { useDispatch } from "react-redux";
import { BACKEND_API } from "../Backend_API.js";
import socket from "../socket.js";
import { useEffect } from "react";

const Sign_up = () => {
  const [id, setId] = useState("");
  const [profilepic, setProfilepic] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(true);
  const [otpVerified, setotpVerified] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUsername] = useState("");
  const [proffesion, setProffesion] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [about, setAbout] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dilogueBox, setDilogueBox] = useState(false);

  const login = () => {
    window.open(`${BACKEND_API}/auth/google`, "_self");
  };

  const loadingFunc = () => {
    setLoading(true);
  };

  const errorHandler = ({ error }) => {
    setLoading(false);
    if (error === "Email is required") {
      setErrorMessage("Email is required");
    }
    else if (error === "Otp is required") {
      setErrorMessage(error);
    }
    else if (error === "An error occurred while sending OTP to the email") {
      setErrorMessage(error);
    }
    else if (error === "Given otp is incorrect") {
      setErrorMessage("Given otp is incorrect");
    }
  }

  useEffect(() => {

    socket.on("otpError", errorHandler);

    socket.on("verified", (data) => {
      const { verified } = data;

      if (verified) {
        setLoading(false);
        setotpVerified(false);
        setCreateAccount(true)
      }
    })

    socket.on("otpVerified", () => {
      setLoading(false);
      setOtpSent(false);
      setotpVerified(true);
    })
  }, [])

  const sendOtp = async () => {
    if (email) {
      loadingFunc();
      const response = await axios.post(`${BACKEND_API}/api/users/otp`, { email });
      if (response.data.data.id) {
        setOtpSent(false);
        setId(response.data.data.id);
        setotpVerified(true);
        setLoading(false);
      } else {
        errorHandler({ error: "An error occurred while sending OTP to the email" });
      }
    }
    else {
      errorHandler({ error: "Email is required" });
    }
  };

  const verify = async () => {
    if (otp) {
      loadingFunc();
      const verify = await axios.post(`${BACKEND_API}/api/users/verify`, { id, otp });
      if (verify.data.data) {
        setotpVerified(false);
        setLoading(false);
        setCreateAccount(true);
      } else {
        errorHandler("Given otp is incorrect");
      }
    }
    else {
      errorHandler({ error: "Otp is required" });
    }
  };

  const signIn = () => navigate("/sign_in");

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

  const handleRegister = async (e) => {
    loadingFunc();
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("about", about);
    if (avatar) formData.append("avatar", avatar);

    try {
      const response = await registerUser(formData);
      dispatch(setUserId({ userId: response.data._id }));
      dispatch(setUserName({ userName: response.data.fullName }));
      dispatch(setUserAvatar({ userAvatar: response.data.avatar }));
      dispatch(setUserAbout({ userAbout: response.data.about }));
      navigate("/");
    } catch (error) {
      alert(error);
      setLoading(false);
    }
  };

  const onClose = () => {
    setErrorMessage("");
  }

  return (
    <div>
      {loading ? (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950">
          <style>{`
    @keyframes pulse-ring {
      0%   { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2);   opacity: 0; }
    }
    @keyframes fade-up {
      0%   { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes dot-bounce {
      0%, 80%, 100% { opacity: 0.3; transform: scaleY(0.6); }
      40%           { opacity: 1;   transform: scaleY(1); }
    }
    .pulse-ring-1 { animation: pulse-ring 1.8s ease-out infinite; }
    .pulse-ring-2 { animation: pulse-ring 1.8s ease-out infinite; animation-delay: 0.6s; }
    .fade-up-text { animation: fade-up 0.6s ease forwards; }
    .dot-1 { animation: dot-bounce 1.2s ease-in-out infinite; }
    .dot-2 { animation: dot-bounce 1.2s ease-in-out infinite; animation-delay: 0.15s; }
    .dot-3 { animation: dot-bounce 1.2s ease-in-out infinite; animation-delay: 0.3s; }
  `}</style>

          {/* Spinner */}
          <div className="relative w-14 h-14 flex items-center justify-center mb-7">
            <span className="pulse-ring-1 absolute w-14 h-14 rounded-full border-2 border-orange-500" />
            <span className="pulse-ring-2 absolute w-14 h-14 rounded-full border-2 border-orange-500" />
            <span className="absolute w-14 h-14 rounded-full border-[3px] border-slate-800 border-t-orange-500 border-r-orange-500 animate-[spin_0.9s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
            <span className="absolute w-9 h-9 rounded-full border-2 border-slate-800 border-b-orange-400 animate-[spin_0.7s_cubic-bezier(0.4,0,0.2,1)_infinite_reverse]" />
          </div>

          {/* Text */}
          <p className="fade-up-text text-slate-200 text-sm font-medium tracking-wide mb-2">
            Loading
          </p>

          {/* Dot bar */}
          <div className="flex items-center gap-1">
            <span className="dot-1 w-1.5 h-3.5 bg-slate-600 rounded-full" />
            <span className="dot-2 w-1.5 h-3.5 bg-slate-600 rounded-full" />
            <span className="dot-3 w-1.5 h-3.5 bg-slate-600 rounded-full" />
          </div>
        </div>
      ) : (<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-10">
        {/* Card */}
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
          {/* Logo */}
          <img src="/Title.png" alt="" className="w-48 object-contain mb-2 text-white" />

          {/* Subtitle */}
          <p className="text-slate-400 text-sm text-center mt-4 mb-6 leading-relaxed">
            Sign up to download weather & pollution data and see environmental vlogs
          </p>

          <div className="w-full flex flex-col items-center gap-3">

            {/* ── Step 1: Email + OTP send ── */}
            {otpSent && (
              <>
                {/* Google button */}
                <button className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-sm font-medium h-11 rounded-xl transition-colors">
                  <img src="/googleIcon.jpg" alt="Google" className="w-5 h-5 rounded-full" />
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 w-full my-1">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-slate-500 text-xs">or</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                {/* Email input */}
                <div className="w-full">
                  <label className="text-xs text-slate-400 mb-1 block">Email address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={sendOtp}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200 mt-1">
                  Send OTP
                </button>
              </>
            )}
            {/* ── Step 2: OTP verify ── */}
            {otpVerified && (
              <>
                <div className="w-full">
                  <label className="text-xs text-slate-400 mb-1 block">Enter OTP</label>
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit code"
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={verify}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200">
                  Verify OTP
                </button>
              </>
            )}
            {/* ── Step 3: Account details ── */}
            {createAccount && (
              <>
                <div className="w-full">
                  <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>

                <div className="w-full">
                  <label className="text-xs text-slate-400 mb-1 block">Username</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>

                <div className="w-full">
                  <label className="text-xs text-slate-400 mb-1 block">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>

                <button
                  onClick={chooseAvatar}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200 mt-1">
                  Next →
                </button>
              </>
            )}
            {/* ── Step 4: Avatar + profession ── */}
            {profilepic && (
              <>
                {/* Avatar picker */}
                <label className="cursor-pointer group">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 group-hover:border-orange-400 transition-colors mx-auto">
                    {avatar ? (
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/profileIcon.png"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs text-orange-400 text-center mt-2">
                    {avatar ? "Change photo" : "Upload photo"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                <div className="w-full">
                  <label className="text-xs text-slate-400 mb-1 block">Profession</label>
                  <input
                    value={proffesion}
                    onChange={(e) => setProffesion(e.target.value)}
                    placeholder="e.g. Meteorologist"
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={handleRegister}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200 mt-1">
                  Create Account
                </button>
              </>
            )}

          </div>
        </div>
        {/* Login link */}
        <p className="text-slate-400 text-sm text-center mt-5">
          Already have an account?{" "}
          <span
            className="text-orange-400 hover:text-orange-300 cursor-pointer font-medium transition-colors"
            onClick={signIn}>
            Login here
          </span>
        </p>
        {dilogueBox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center">

              {/* Error icon */}
              <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <h2 className="text-base font-semibold text-red-400 mb-2">
                Error
              </h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">{errorMessage}</p>
              <button
                onClick={onClose}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200">
                OK
              </button>
            </div>
          </div>
        )}
      </div>)}</div>
  );
};

export default Sign_up;