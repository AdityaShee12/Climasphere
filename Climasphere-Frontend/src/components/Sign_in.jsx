import { useState } from "react";
import { loginUser } from "../services/user.service.jsx";
import { useNavigate } from "react-router-dom";
import {
  setUserId,
  setUserName,
  setUserFullName,
  setUserAvatar,
  setUserAbout,
} from "../features/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BACKEND_API } from "../Backend_API.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import socket from "../socket.js";
import { useEffect } from "react";

const Sign_in = () => {
  const [id, setId] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [createPassword, setCreatePassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dilogueBox, setDilogueBox] = useState(false);

  const loadingFunc = () => {
    setLoading(true);
  };

  const handleLogin = async (e) => {
    loadingFunc();
    e.preventDefault();
    const credentials = { userName, email, password };
    try {
      const user = await loginUser(credentials);
      const data = user.data.loggedInUser;
      data.email === "kundusandip006@gmail.com" &&
        data.userName === "kundusandip"

      dispatch(setUserId({ userId: data._id }));
      dispatch(setUserName({ userName: data.userName }));
      dispatch(setUserFullName({ fullName: data.fullName }));
      dispatch(setUserAvatar({ userAvatar: data.avatar }));
      dispatch(setUserAbout({ userAbout: data.about }));
      navigate("/");

    } catch (error) {
      setLoading(false);
      setErrorMessage(error?.response?.data?.message || "Login failed. Please try again.");
      setDilogueBox(true);
    }
  };

  const forgetPassword = () => {
    setSignIn(false);
    setChangePassword(true);
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
    else if (error === "Given otp is not correct") {
      setErrorMessage("Given otp is not correct");
    }
  }

  useEffect(() => {
    socket.on("otpError", errorHandler);
    socket.on("verified", (data) => {
      const { verified } = data;
      if (verified) {
        setLoading(false);
        setOtpVerified(false);
        setCreateAccount(true);
      }
    })

    socket.on("otpVerified", () => {
      setLoading(false);
      setChangePassword(false);
      setOtpVerified(true)
    })

    return () => {
      socket.off("otpError", errorHandler);
      socket.off("verified");
      socket.off("otpVerified");
    };
  }, [])

  const sendOTP = async () => {
    if (email) {
      loadingFunc();
      const response = await axios.post(`${BACKEND_API}/api/users/otp`, { email });
      if (response.data.data.id) {
        setId(response.data.data.id);
        setChangePassword(false);
        setId(response.data.data.id);
        setOtpVerified(true);
        setLoading(false);
      }
    }
    else {
      errorHandler({ error: "An error occurred while sending OTP to the email" });
    }
  };

  const verify = async () => {
    if (otp) {
      loadingFunc();
      const verify = await axios.post(`${BACKEND_API}/api/users/verify`, { id, otp });
      if (verify.data.data) {
        setOtpVerified(false);
        setLoading(false);
        setCreatePassword(true);
      } else {
        errorHandler("Given otp is incorrect");
      }
    }
    else {
      errorHandler({ error: "Otp is required" });
    }
  };

  const passwordMaking = async () => {
    loadingFunc();
    try {
      const response = await axios.post(
        `${BACKEND_API}/api/users/passwordChange`,
        { password, email }
      );

      const data = response.data.data;
      
      dispatch(setUserId({ userId: data._id }));
      dispatch(setUserName({ userName: data.fullName }));
      dispatch(setUserAvatar({ userAvatar: data.avatar }));
      dispatch(setUserAbout({ userAbout: data.about }));
      navigate("/");
    } catch (error) {
      console.log("Error:", error);
    }
    setLoading(false);
  };

  const onClose = () => {
    setErrorMessage(false);
    setDilogueBox(false);
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
      ) : (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-10">
          {/* Card */}
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
            {/* Logo */}
            <img src="/Title.png" alt="" className="w-48 object-contain mb-6 text-white" />
            {signIn && (
              <div className="w-full flex flex-col gap-3">
                {/* Username / Email */}
                <div className="w-full">
                  <label className="text-xs text-slate-400 mb-1 block">Username or Email</label>
                  <input
                    id="email"
                    type="text"
                    placeholder="you@example.com"
                    value={userName || email}
                    onChange={(e) => {
                      const value = e.target.value;
                      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                      if (isEmail) {
                        setEmail(value);
                        setuserName("");
                      } else {
                        setuserName(value);
                        setEmail("");
                      }
                    }}
                    required
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="w-full">
                  <label className="text-xs text-slate-400 mb-1 block">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>

                {/* Sign in button */}
                <button
                  onClick={handleLogin}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200 mt-2">
                  Sign In
                </button>
                <div
                  className="cursor-pointer text-orange-400 hover:text-orange-300 text-sm transition-colors"
                  onClick={forgetPassword}>
                  Forgot password?
                </div>
              </div>
            )}
            {changePassword && (
              <div className="w-full mt-3">
                <div className="w-full mb-3">
                  <label className="text-xs text-slate-400 mb-1 block">Email</label>
                  <input
                    type="text"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={sendOTP}
                  className="w-full bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-100 font-semibold text-sm h-11 rounded-xl border border-slate-600 transition-all duration-200">
                  Send OTP
                </button>
              </div>
            )}
            {otpVerified && (
              <>
                <div className="w-full mb-3">
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
                  className="w-full bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-100 font-semibold text-sm h-11 rounded-xl border border-slate-600 transition-all duration-200">
                  Verify OTP
                </button>
              </>
            )}
            {createPassword && (
              <div className="w-full">
                <div className="w-full mb-3">
                  <label className="text-xs text-slate-400 mb-1 block">Password</label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors pr-10"
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <button
                  onClick={passwordMaking}
                  className="w-full bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-100 font-semibold text-sm h-11 rounded-xl border border-slate-600 transition-all duration-200">
                  Set Password
                </button>
              </div>
            )}
          </div>
          {/* Sign up link */}
          <p className="text-slate-400 text-sm text-center mt-5">
            Don't have an account?{" "}
            <span
              className="text-orange-400 hover:text-orange-300 cursor-pointer font-medium transition-colors"
              onClick={() => { navigate("/sign_up") }}>
              Sign up
            </span>
          </p>
        </div>)}
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
    </div>
  );
};

export default Sign_in;