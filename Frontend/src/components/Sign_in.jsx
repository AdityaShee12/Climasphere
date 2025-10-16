import React, { useEffect, useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import {
  setUserId,
  setUserName,
  setUserAvatar,
  setUserProffesion,
} from "../features/userSlice";
import { useDispatch } from "react-redux";

const Sign_in = () => {
  const [signIn, setSignIn] = useState(true);
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordset, setPasswordSet] = useState(false);
  const [createPassword, setCreatePassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = {
      userName,
      email,
      password,
    };
    try {
      const user = await loginUser(credentials);
      console.log(user);
      dispatch(setUserId({ userId: user.data.loggedInUser._id }));
      dispatch(setUserName({ userName: user.data.loggedInUser.userName }));
      dispatch(setUserAvatar({ userAvatar: user.data.loggedInUser.avatar }));
      dispatch(setUserProffesion({ userAbout: user.data.loggedInUser.proffesion }));
      navigate("/homepage");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center space-y-4">
      <div className="w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[30rem] xl:w-[28rem] p-8 rounded-xl flex flex-col items-center border border-gray-300 space-y-4">
        <h1 className="text-3xl sm:text-4xl text-center font-bold mb-4 font-mono">
          Chat_Book
        </h1>
        <div className="w-full space-y-4">
          <input
            id="email"
            type="text"
            placeholder="Username or email"
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
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-slate-100 text-base sm:text-lg"
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-slate-100 text-base sm:text-lg"
          />

          <button
            onClick={handleLogin}
            className="mt-4 w-full text-black font-bold py-2 px-4 rounded transition duration-300 font-mono hover:shadow-lg hover:shadow-sky-400 border border-gray-300 text-center text-base sm:text-lg">
            Sign in
          </button>
        </div>
      </div>

      <div className="w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[30rem] xl:w-[28rem] p-4 rounded-xl flex flex-wrap items-center justify-center border border-gray-300 text-gray-700 text-center text-sm sm:text-base">
        Don't have an account?{" "}
        <span
          className="ml-2 text-blue-500 hover:text-blue-600 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
          onClick={() => navigate("/sign_up")}>
          Sign up
        </span>
      </div>
    </div>
  );
};

export default Sign_in;

// return (
//   <div className="h-screen p-4 flex flex-col items-center justify-center space-y-4">
//     <div className="max-w-xl sm:max-w-sm md:max-w-md w-full p-8 rounded-xl flex flex-col  items-center border border-gray-300 space-y-4">
//       <h1 className="text-4xl text-center font-bold mb-4 font-mono">
//         Chat_Book
//       </h1>
//       {signIn ? (
//         <div className="space-y-4">
//           <input
//             id="email"
//             type="text"
//             placeholder="Username or email"
//             value={userName || email}
//             onChange={(e) => {
//               const value = e.target.value;
//               // simple email regex check
//               const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
//               if (isEmail) {
//                 setEmail(value);
//                 setuserName("");
//               } else {
//                 setuserName(value);
//                 setEmail("");
//               }
//             }}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-slate-100"
//           />
//           <input
//             id="password"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-slate-100"
//           />{" "}
//           <button
//             onClick={handleLogin}
//             className="mt-4 max-w-xs sm:max-w-sm md:max-w-md w-full text-black font-bold py-2 px-4 rounded transition duration-300 font-mono hover:shadow-lg hover:shadow-sky-400 border border-gray-300 text-center">
//             Sign in
//           </button>
//           <div
//             className="flex justify-center cursor-pointer"
//             onClick={() => {
//               forgetPassword();
//             }}>
//             Forgot password?
//           </div>
//         </div>
//       ) : (
//         <div>
//           {otpVerified && (
//             <div
//               className="w-[70vw] h-auto flex flex-col items-center lg:w-[30rem]
//            xl:w-[30vw] xl:h-auto
//          ">
//               <input
//                 type="number"
//                 value={otp}
//                 onChange={(e) => {
//                   setOtp(e.target.value);
//                 }}
//                 placeholder="Enter your OTP"
//                 className="w-[60vw] h-[7vh] border border-slate-400 text-xl rounded-xl pl-2  lg:w-[39vw] lg:text-[1.7rem]]  xl:w-[25vw] xl:text-[1rem] m-[18%] lg:m-[15%] xl:m-[8%]"
//               />
//               <button
//                 onClick={verify}
//                 className="w-[60vw] h-[7vh] border border-slate-400 text-xl rounded-xl pl-2  lg:w-[39vw] lg:text-[1.7rem]]  xl:w-[25vw] xl:text-[1rem] mb-[18%] lg:mb-[15%] xl:mb-[8%]">
//                 Verify your OTP
//               </button>
//             </div>
//           )}
//           {createPassword && (
//             <>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-slate-100"
//               />{" "}
//               <button
//                 onClick={() => {
//                   passwordMaking();
//                 }}
//                 className="mt-4 max-w-xs sm:max-w-sm md:max-w-md w-full text-black font-bold py-2 px-4 rounded transition duration-300 font-mono hover:shadow-lg hover:shadow-sky-400 border border-gray-300 text-center">
//                 Set Password
//               </button>
//             </>
//           )}
//           {changePassword && (
//             <div>
//               <input
//                 id="email"
//                 type="text"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                 }}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-slate-100"
//               />
//               <button
//                 onClick={() => sendOTP()}
//                 className="mt-4 max-w-xs sm:max-w-sm md:max-w-md w-full text-black font-bold py-2 px-4 rounded transition duration-300 font-mono hover:shadow-lg hover:shadow-sky-400 border border-gray-300 text-center">
//                 Send OTP
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//     <div className="max-w-xs sm:max-w-sm md:max-w-md w-full p-4 rounded-xl flex items-center justify-center border border-gray-300 text-gray-700 text-center">
//       Don't have an account?
//       <div
//         className="inline-block text-blue-500 hover:text-blue-600 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-500 hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
//         onClick={() => navigate("/sign_up")}>
//         {" "}
//         Sign up
//       </div>
//     </div>
//   </div>
// );
