import { useState } from "react";
import { HiHome, HiPlusCircle, HiChatBubbleLeft } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const ButtomNavbar = () => {
    const [dilogueBox, setDilogueBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { userName } = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const onClose = () => {
        if (errorMessage) {
            navigate("/sign_in");
            setDilogueBox(false);
        }
    };

    const postFunc = () => {
        setErrorMessage("The creating post, writing blog system will be available soon");
        setDilogueBox(true);
        // if (userName) {
        //     navigate("/post");
        // } else {
        //     setErrorMessage("If you want to post photos and videos about climate, you have to login first");
        //     setDilogueBox(true);
        // }
    };

    const messageFunc = () => {
        if (userName) {
            navigate("/chatLayout");
        } else {
            setErrorMessage("If you want to chat with others about climate then you have to login first");
            setDilogueBox(true);
        }
    };

    return (
        <div>
            <nav className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center h-16 z-50">

                <button
                    className="p-3 rounded-xl transition-colors hover:text-orange-400 hover:bg-orange-500/10"
                    onClick={() => navigate("/")}>
                    {isActive("/") ? (
                        <HiHome className="text-2xl text-orange-400" />
                    ) : (
                        <HiHome className="text-2xl text-slate-400" />
                    )}
                </button>

                <button
                    className="p-3 rounded-xl transition-colors hover:text-orange-400 hover:bg-orange-500/10"
                    onClick={postFunc}>
                    {isActive("/post") ? (
                        <HiPlusCircle className="text-2xl text-orange-400" />
                    ) : (
                        <HiPlusCircle className="text-2xl text-slate-400" />
                    )}
                </button>

                <button
                    className="p-3 rounded-xl transition-colors hover:text-orange-400 hover:bg-orange-500/10"
                    onClick={messageFunc}>
                    {isActive("/chat") ? (
                        <HiChatBubbleLeft className="text-2xl text-orange-400" />
                    ) : (
                        <HiChatBubbleLeft className="text-2xl text-slate-400" />
                    )}
                </button>

            </nav>

            {dilogueBox && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center">
                        <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 className="text-base font-semibold text-red-400 mb-2">Error</h2>
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

export default ButtomNavbar;

// import { useState } from "react";
// import {
//     HiHome,
//     HiPlusCircle,
//     HiChatBubbleLeft,
// } from "react-icons/hi2";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const ButtomNavbar = () => {

//     const [dilogueBox, setDilogueBox] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const { userName, fullName, avatar, userproffesion } = useSelector(
//         (state) => state.user
//     );
//     const navigate = useNavigate();

//     const onClose = () => {
//         if (errorMessage) {
//             navigate("/sign_in");
//             setDilogueBox(false);
//         }
//     }

//     const errorMessageFunc = (errorsms) => {
//         setErrorMessage(errorsms);
//     }

//     const postFunc = () => {
//         if (userName) {

//             navigate("/post");
//         }
//         else {
//             setDilogueBox(true)
//             errorMessageFunc("If you want to post photos and videos about climate, you have to login first");
//         }
//     }

//     const messageFunc = () => {
//         if (userName) {
//             console.log("UNE", userName);
//             navigate("/chat")
//         }
//         else {
//             setDilogueBox(true)
//             errorMessageFunc("If you want to chat with others about climate then you have to login first");
//         }
//     }

//     return (
//         <div>
//             <nav className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center h-16 z-50">
//                 <button
//                     onClick={() => navigate("/")}
//                     className="p-3 rounded-xl text-orange-400 bg-orange-500/10"
//                 >
//                     <HiHome className="text-2xl" />
//                 </button>
//                 <button
//                     onClick={postFunc}
//                     className="p-3 rounded-xl text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
//                 >
//                     <HiPlusCircle className="text-2xl" />
//                 </button>
//                 <button
//                     onClick={messageFunc}
//                     className="p-3 rounded-xl text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors"
//                 >
//                     <HiChatBubbleLeft className="text-2xl" />
//                 </button>
//             </nav>
//             {dilogueBox && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center">
//                     <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
//                     <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center">

//                         {/* Error icon */}
//                         <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
//                             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                 <circle cx="12" cy="12" r="10" />
//                                 <line x1="12" y1="8" x2="12" y2="12" />
//                                 <line x1="12" y1="16" x2="12.01" y2="16" />
//                             </svg>
//                         </div>

//                         <h2 className="text-base font-semibold text-red-400 mb-2">
//                             Error
//                         </h2>
//                         <p className="text-slate-400 text-sm mb-6 leading-relaxed">{errorMessage}</p>
//                         <button
//                             onClick={onClose}
//                             className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm h-11 rounded-xl transition-all duration-200">
//                             OK
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
// export default ButtomNavbar;