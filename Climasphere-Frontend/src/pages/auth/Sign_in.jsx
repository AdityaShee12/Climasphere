import { useState } from "react";
import { loginUser } from "../../services/auth.service.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../services/auth.service.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Sign_in = () => {
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

  const loadingFunc = () => {
    setLoading(true);
  };

  const handleLogin = async (e) => {
    loadingFunc();
    e.preventDefault();

    if ((!userName && !email) || !password) {
      setLoading(true);
      errorHandler({ error: "Username or email is required" });
    }

    const loginData = {
      password,
    };

    if (email) {
      loginData.email = email;
    }
    if (userName) {
      loginData.userName = userName;
    }

    try {
      await loginUser(
        loginData,
        dispatch
      );
      navigate("/layout");
    } catch (error) {
      console.log("EM", error?.message);
      setLoading(false);
      if (error?.message === "Account does not exist") {
        errorHandler({ error: "Account does not exist" });
      } else if (error?.message === "Given password is wrong") {
        errorHandler({ error: "Given password is wrong" });
      }
    }
  };

  const errorHandler = ({ error }) => {
    setLoading(false);
    if (error === "Username or email is required") {
      setErrorMessage("Username or email is required");
    }
    else if (error === "Account does not exist") {
      setErrorMessage("Account does not exist");
    }
    else if (error === "Given password is wrong") {
      setErrorMessage("Given password is wrong");
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

  const forgetPassword = () => {
    setSignIn(false);
    setChangePassword(true);
  };

  const passwordMaking = async () => {
    loadingFunc();
    try {
      const response = await resetPassword({ password, email }, dispatch);
      navigate("/layout");
    } catch (error) {
      console.log("Error:", error);
    }
    setLoading(false);
  };

  const onClose = () => {
    setErrorMessage(false);
  }

return (
    <>
      <div className="font-sans min-h-screen bg-slate-950 relative overflow-hidden">
        {loading ? (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 z-[100]">
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

            <div className="relative w-14 h-14 flex items-center justify-center mb-7">
              <span className="pulse-ring-1 absolute w-14 h-14 rounded-full border-2 border-orange-500" />
              <span className="pulse-ring-2 absolute w-14 h-14 rounded-full border-2 border-orange-500" />
              <span className="absolute w-14 h-14 rounded-full border-[3px] border-slate-800 border-t-orange-500 border-r-orange-500 animate-[spin_0.9s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
              <span className="absolute w-9 h-9 rounded-full border-2 border-slate-800 border-b-orange-400 animate-[spin_0.7s_cubic-bezier(0.4,0,0.2,1)_infinite_reverse]" />
            </div>

            <p className="fade-up-text text-slate-200 text-sm font-medium tracking-wide mb-2">
              Loading
            </p>

            <div className="flex items-center gap-1">
              <span className="dot-1 w-1.5 h-3.5 bg-slate-600 rounded-full" />
              <span className="dot-2 w-1.5 h-3.5 bg-slate-600 rounded-full" />
              <span className="dot-3 w-1.5 h-3.5 bg-slate-600 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-[420px] flex flex-col gap-3">

              {/* Main card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-8 py-9 flex flex-col items-center shadow-2xl">

                <img src="/LetterBee.png" alt="LetterBee" className="w-44 mb-7 opacity-90" />

                {signIn ? (
                  /* Sign In form */
                  <div className="w-full">

                    {/* Username / email */}
                    <div className="w-full mb-5">
                      <input
                        type="text"
                        placeholder="Username or email"
                        value={email || userName}
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
                    <div className="relative w-full mb-5">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 pr-12 outline-none transition-colors"
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 hover:text-orange-400 text-base flex items-center justify-center transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    <button
                      onClick={handleLogin}
                      className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200"
                    >
                      Sign in
                    </button>

                    <p
                      onClick={forgetPassword}
                      className="mt-4 text-slate-500 hover:text-orange-400 text-sm cursor-pointer text-center transition-colors"
                    >
                      Forgot password?
                    </p>
                  </div>
                ) : (
                  /* OTP / reset flow */
                  <div className="w-full">
                    {otpVerified && (
                      <>
                        <div className="w-full mb-5">
                          <input
                            type="number"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter your OTP"
                            className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 rounded-xl px-4 h-11 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ fontSize: '20px', letterSpacing: '0.25em' }}
                          />
                        </div>
                        <button
                          onClick={verify}
                          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200 mb-4"
                        >
                          Verify OTP
                        </button>
                      </>
                    )}
                    {createPassword && (
                      <>
                        <div className="relative w-full mb-5">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 pr-12 outline-none transition-colors"
                          />
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 hover:text-orange-400 text-base flex items-center justify-center transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        <button
                          onClick={passwordMaking}
                          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200 mb-4"
                        >
                          Set Password
                        </button>
                      </>
                    )}
                    {changePassword && (
                      <>
                        <div className="w-full mb-5">
                          <input
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-800 border border-slate-700 focus:border-orange-400 text-slate-100 placeholder-slate-500 text-sm rounded-xl px-4 h-11 outline-none transition-colors"
                          />
                        </div>
                        <button
                          onClick={sendOTP}
                          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200 mb-4"
                        >
                          Send OTP
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-center text-slate-400 text-sm">
                Don't have an account?{' '}
                <span
                  onClick={() => navigate("/sign_up")}
                  className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer transition-colors"
                >
                  Sign up
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Error Modal */}
        {errorMessage && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl px-8 py-9 w-full max-w-[380px] text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-red-400 text-base font-bold mb-2">
                Something went wrong
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{errorMessage}</p>
              <button
                onClick={onClose}
                className="w-full h-[46px] bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-sm font-semibold transition-all duration-200"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Sign_in;

// return (
//   <>
//     <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
//         .login-root * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }

//         .login-root {
//           font-family: 'DM Sans', sans-serif;
//           min-height: 100vh;
//           background: #0d0d0f;
//           position: relative;
//           overflow: hidden;
//         }

//         /* Animated background blobs */
//         .lb-blob {
//           position: fixed;
//           border-radius: 50%;
//           filter: blur(90px);
//           opacity: 0.18;
//           animation: lbBlobFloat 12s ease-in-out infinite alternate;
//           pointer-events: none;
//           z-index: 0;
//         }
//         .lb-blob-1 {
//           width: 520px; height: 520px;
//           background: #4337e6;
//           top: -120px; left: -120px;
//           animation-delay: 0s;
//         }
//         .lb-blob-2 {
//           width: 380px; height: 380px;
//           background: #a78bfa;
//           bottom: -80px; right: -80px;
//           animation-delay: -4s;
//         }
//         .lb-blob-3 {
//           width: 260px; height: 260px;
//           background: #38bdf8;
//           top: 50%; left: 55%;
//           animation-delay: -8s;
//         }
//         @keyframes lbBlobFloat {
//           0%   { transform: translate(0, 0) scale(1); }
//           100% { transform: translate(30px, 40px) scale(1.08); }
//         }

//         /* Grain overlay */
//         .lb-grain {
//           position: fixed;
//           inset: 0;
//           z-index: 1;
//           pointer-events: none;
//           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
//           background-repeat: repeat;
//           background-size: 180px;
//           opacity: 0.5;
//         }

//         /* Loading screen */
//         .lb-loading {
//           position: fixed;
//           inset: 0;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           background: #0d0d0f;
//           z-index: 100;
//         }
//         .lb-loader-ring {
//           width: 52px; height: 52px;
//           border: 3px solid rgba(67,55,230,0.2);
//           border-top-color: #4337e6;
//           border-radius: 50%;
//           animation: lbSpin 0.8s linear infinite;
//         }
//         @keyframes lbSpin { to { transform: rotate(360deg); } }
//         .lb-loading-text {
//           margin-top: 18px;
//           color: rgba(255,255,255,0.35);
//           font-size: 13px;
//           letter-spacing: 0.12em;
//           text-transform: uppercase;
//           font-weight: 500;
//         }

//         /* Page layout */
//         .lb-page-wrapper {
//           position: relative;
//           z-index: 2;
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 24px 16px;
//         }

//         .lb-column {
//           width: 100%;
//           max-width: 420px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//           animation: lbFadeUp 0.5s ease both;
//         }
//         @keyframes lbFadeUp {
//           from { opacity: 0; transform: translateY(22px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* Main card */
//         .lb-card {
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.08);
//           border-radius: 20px;
//           padding: 36px 32px 32px;
//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .lb-logo {
//           width: 180px;
//           margin-bottom: 28px;
//           filter: brightness(0) invert(1);
//           opacity: 0.92;
//         }

//         /* Field wrapper */
//         .lb-field-wrap {
//           position: relative;
//           width: 100%;
//           margin-bottom: 20px;
//         }

//         .lb-input {
//           width: 100%;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid rgba(255,255,255,0.09);
//           border-radius: 12px;
//           padding: 13px 16px;
//           color: rgba(255,255,255,0.9);
//           font-size: 14.5px;
//           font-family: 'DM Sans', sans-serif;
//           outline: none;
//           transition: border-color 0.2s, background 0.2s;
//         }
//         .lb-input::placeholder { color: rgba(255,255,255,0.22); }
//         .lb-input:focus {
//           border-color: rgba(67,55,230,0.7);
//           background: rgba(67,55,230,0.06);
//         }
//         .lb-input[type=number]::-webkit-inner-spin-button,
//         .lb-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
//         .lb-input[type=number] { -moz-appearance: textfield; }

//         /* Password wrapper */
//         .lb-pw-wrap {
//           position: relative;
//           width: 100%;
//           margin-bottom: 20px;
//         }
//         .lb-pw-wrap .lb-input {
//           padding-right: 48px;
//         }
//         .lb-eye-btn {
//           position: absolute;
//           right: 14px;
//           top: 50%;
//           transform: translateY(-50%);
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: rgba(255,255,255,0.3);
//           font-size: 16px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: color 0.18s;
//           padding: 0;
//         }
//         .lb-eye-btn:hover { color: rgba(255,255,255,0.65); }

//         /* Primary button */
//         .lb-btn-primary {
//           width: 100%;
//           height: 50px;
//           background: linear-gradient(135deg, #4337e6 0%, #6d28d9 100%);
//           border: none;
//           border-radius: 12px;
//           color: #fff;
//           font-size: 15px;
//           font-weight: 600;
//           font-family: 'DM Sans', sans-serif;
//           cursor: pointer;
//           letter-spacing: 0.02em;
//           transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
//           box-shadow: 0 4px 24px rgba(67,55,230,0.35);
//           margin-bottom: 0;
//         }
//         .lb-btn-primary:hover {
//           opacity: 0.92;
//           transform: translateY(-1px);
//           box-shadow: 0 8px 32px rgba(67,55,230,0.45);
//         }
//         .lb-btn-primary:active { transform: translateY(0); }

//         /* Forgot password link */
//         .lb-forgot {
//           margin-top: 14px;
//           color: rgba(255,255,255,0.32);
//           font-size: 13.5px;
//           cursor: pointer;
//           text-align: center;
//           transition: color 0.18s;
//           letter-spacing: 0.01em;
//         }
//         .lb-forgot:hover { color: #7c6ff7; }

//         /* Footer card */
//         .lb-footer-card {
//           background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(255,255,255,0.07);
//           border-radius: 14px;
//           padding: 18px 24px;
//           text-align: center;
//           color: rgba(255,255,255,0.35);
//           font-size: 14px;
//         }
//         .lb-footer-card .lb-link {
//           color: #7c6ff7;
//           cursor: pointer;
//           font-weight: 600;
//           transition: color 0.18s;
//         }
//         .lb-footer-card .lb-link:hover { color: #a89ff9; }

//         /* Error modal */
//         .lb-modal-backdrop {
//           position: fixed;
//           inset: 0;
//           z-index: 200;
//           background: rgba(0,0,0,0.65);
//           backdrop-filter: blur(6px);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 16px;
//           animation: lbFadeIn 0.18s ease both;
//         }
//         @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
//         .lb-modal-box {
//           background: #16161e;
//           border: 1px solid rgba(255,255,255,0.09);
//           border-radius: 20px;
//           padding: 36px 32px 28px;
//           width: 100%;
//           max-width: 380px;
//           text-align: center;
//           animation: lbScaleIn 0.2s ease both;
//         }
//         @keyframes lbScaleIn {
//           from { transform: scale(0.94); opacity: 0; }
//           to   { transform: scale(1);    opacity: 1; }
//         }
//         .lb-modal-icon {
//           width: 48px; height: 48px;
//           background: rgba(239,68,68,0.12);
//           border: 1px solid rgba(239,68,68,0.25);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 16px;
//           font-size: 20px;
//         }
//         .lb-modal-title {
//           color: #ef4444;
//           font-size: 16px;
//           font-weight: 700;
//           margin-bottom: 10px;
//           font-family: 'Playfair Display', serif;
//         }
//         .lb-modal-msg {
//           color: rgba(255,255,255,0.55);
//           font-size: 14px;
//           line-height: 1.6;
//           margin-bottom: 24px;
//         }
//         .lb-modal-btn {
//           width: 100%;
//           height: 46px;
//           background: linear-gradient(135deg, #4337e6, #6d28d9);
//           border: none;
//           border-radius: 11px;
//           color: #fff;
//           font-size: 14.5px;
//           font-weight: 600;
//           font-family: 'DM Sans', sans-serif;
//           cursor: pointer;
//           transition: opacity 0.2s;
//         }
//         .lb-modal-btn:hover { opacity: 0.88; }

//         /* Responsive */
//         @media (max-width: 480px) {
//           .lb-card { padding: 28px 18px 24px; }
//           .lb-logo { width: 150px; }
//         }
//       `}</style>

//     <div className="login-root">
//       <div className="lb-blob lb-blob-1" />
//       <div className="lb-blob lb-blob-2" />
//       <div className="lb-blob lb-blob-3" />
//       <div className="lb-grain" />

//       {loading ? (
//         <div className="lb-loading">
//           <div className="lb-loader-ring" />
//           <p className="lb-loading-text">Loading</p>
//         </div>
//       ) : (
//         <div className="lb-page-wrapper">
//           <div className="lb-column">

//             {/* Main card */}
//             <div className="lb-card">
//               <img src="/LetterBee.png" alt="LetterBee" className="lb-logo" />

//               {signIn ? (
//                 /* ── Sign In form ── */
//                 <div style={{ width: '100%' }}>
//                   {/* Username / email */}
//                   <div className="lb-field-wrap">
//                     <input
//                       type="text"
//                       placeholder="Username or email"
//                       value={email || userName}
//                       onChange={(e) => {

//                         const value = e.target.value;

//                         const isEmail =
//                           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//                         if (isEmail) {
//                           setEmail(value);
//                           setuserName("");
//                         } else {
//                           setuserName(value);
//                           setEmail("");
//                         }
//                       }}
//                       required
//                       className="lb-input"
//                     />
//                   </div>

//                   {/* Password */}
//                   <div className="lb-pw-wrap">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       className="lb-input"
//                     />
//                     <button
//                       className="lb-eye-btn"
//                       onClick={() => setShowPassword(!showPassword)}
//                       type="button"
//                     >
//                       {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </button>
//                   </div>

//                   <button onClick={handleLogin} className="lb-btn-primary">
//                     Sign in
//                   </button>

//                   <div className="lb-forgot" onClick={forgetPassword}>
//                     Forgot password?
//                   </div>
//                 </div>
//               ) : (
//                 /* ── OTP / reset flow ── */
//                 <div style={{ width: '100%' }}>
//                   {otpVerified && (
//                     <>
//                       <div className="lb-field-wrap">
//                         <input
//                           type="number"
//                           value={otp}
//                           onChange={(e) => setOtp(e.target.value)}
//                           placeholder="Enter your OTP"
//                           className="lb-input"
//                           style={{ fontSize: '20px', letterSpacing: '0.25em' }}
//                         />
//                       </div>
//                       <button onClick={verify} className="lb-btn-primary" style={{ marginBottom: '16px' }}>
//                         Verify OTP
//                       </button>
//                     </>
//                   )}

//                   {createPassword && (
//                     <>
//                       <div className="lb-pw-wrap">
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           placeholder="New password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           required
//                           className="lb-input"
//                         />
//                         <button
//                           className="lb-eye-btn"
//                           onClick={() => setShowPassword(!showPassword)}
//                           type="button"
//                         >
//                           {showPassword ? <FaEyeSlash /> : <FaEye />}
//                         </button>
//                       </div>
//                       <button onClick={passwordMaking} className="lb-btn-primary" style={{ marginBottom: '16px' }}>
//                         Set Password
//                       </button>
//                     </>
//                   )}

//                   {changePassword && (
//                     <>
//                       <div className="lb-field-wrap">
//                         <input
//                           type="text"
//                           placeholder="Enter your email"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                           required
//                           className="lb-input"
//                         />
//                       </div>
//                       <button onClick={sendOTP} className="lb-btn-primary" style={{ marginBottom: '16px' }}>
//                         Send OTP
//                       </button>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="lb-footer-card">
//               Don't have an account?{' '}
//               <span className="lb-link" onClick={() => navigate("/sign_up")}>Sign up</span>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* Error Modal */}
//       {errorMessage && (
//         <div className="lb-modal-backdrop">
//           <div className="lb-modal-box">
//             <div className="lb-modal-icon">⚠️</div>
//             <h2 className="lb-modal-title">Something went wrong</h2>
//             <p className="lb-modal-msg">{errorMessage}</p>
//             <button className="lb-modal-btn" onClick={onClose}>Got it</button>
//           </div>
//         </div>
//       )}
//     </div>
//   </>
// );