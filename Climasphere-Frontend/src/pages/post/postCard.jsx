import React, { useState, useEffect } from "react";
import {
    MessageCircle,
    Share2,
    MoreHorizontal,
    Send,
    X,
} from "lucide-react";
import ReactionBar from "./ReactionBar";
import { postAPI } from "../../api/api";
import { useSelector } from "react-redux";
import socket from "../../sockets/socket.js";

const PostCard = ({ fullName, avatar, postDetails, postId }) => {
    const [userId, setUserId] = useState("");
    const { user } = useSelector((state) => state.user);
    const [post, setPost] = useState(postDetails);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isImageOpen, setIsImageOpen] = useState(false);
    const [comments, setComments] = useState("");
    const [postcomments, setPostComments] = useState([]);
    const [name, setName] = useState("");
    const [ownAvatar, setOwnAvatar] = useState("");

    useEffect(() => {
        if (!user) return;
        const { _id, fullName, userName, avatar } = user;
        setUserId(_id);
        setName(fullName);
        setOwnAvatar(avatar);
    }, [user]);

    // Lock background scroll while the lightbox is open
    useEffect(() => {
        document.body.style.overflow = isImageOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isImageOpen]);

    const onVote = async (reaction, indicator) => {
        if (reaction) {
            const response = await postAPI.likePost(userId, postId, reaction, indicator);
            if (response?.data) setPost(response?.data?.post);
        }
    };

    useEffect(() => {
        socket.emit("postViewers", userId)
    }, [])

    const handleSubmit = async () => {
        if (!commentText.trim()) return;
        socket.emit("WriteComment", { userId, postId, commentText })
        // const response = await postAPI.addComment(userId, postId, commentText);
        // if (response?.data?.post) setPost(response?.data?.post);
        setPostComments((prev) => [
            ...prev,
            {
                comment: commentText,
                userId,
                name: name,
                avatar: ownAvatar,
            },
        ]);
        setCommentText("");
    };

    useEffect(() => {
        console.log("PCOMMENTS", postcomments);
    }, [postcomments]);

    useEffect(() => {
        // socket.on("ReceiveComments", (comments) => {
        //     setPostComments(comments);
        // });
        return () => {
            socket.off("ReceiveComments")
        };
    }, []);

    const initials = fullName
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const zoomImage = () => {
        setIsImageOpen(true);
        socket.emit("getComments", postId);
    }

    useEffect(() => {
        socket.on("ReceiveComments", (data) => {
            console.log("Comments", data);
            if (data.success) {
                setPostComments(data.comments);
            }
        });

        return () => {
            socket.off("ReceiveComments");
        };
    }, []);

    return (
        <>
            <article className="bg-white rounded-2xl border border-slate-200 p-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={avatar}
                            alt=""
                            className="w-11 h-11 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm shrink-0 object-cover"
                        />
                        <div>
                            <p className="font-semibold text-slate-900 text-sm leading-tight">
                                {fullName}
                            </p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100">
                        <MoreHorizontal size={18} />
                    </button>
                </div>

                {/* Content */}
                <p className="text-slate-800 text-[15px] leading-relaxed mt-3">
                    {post.content}
                </p>

                {post?.pic && (
                    <button
                        type="button"
                        onClick={zoomImage}
                        className="mt-3 w-full block cursor-zoom-in"
                    >
                        <img
                            src={post.pic}
                            alt="Post"
                            className="w-full max-h-[500px] object-cover rounded-xl border border-slate-200 hover:brightness-95 transition"
                        />
                    </button>
                )}

                {/* Stats row */}
                <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                    <span>
                        {post?.likesCount + post?.disLikesCount} reactions ·{" "}
                        {post?.commentsCount} comments
                    </span>
                </div>

                <div className="h-px bg-slate-100 my-3" />

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <ReactionBar
                        likes={post.likes}
                        dislikes={post.dislikes}
                        userVote={post.userVote}
                        onVote={onVote}
                    />
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowComments((prev) => !prev)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-slate-600 hover:bg-slate-50 border border-slate-200"
                        >
                            <MessageCircle size={15} />
                            <span className="font-medium">Comment</span>
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-slate-600 hover:bg-slate-50 border border-slate-200">
                            <Share2 size={15} />
                            <span className="font-medium hidden sm:inline">Share</span>
                        </button>
                    </div>
                </div>

                {/* Comments */}
                {postcomments?.map((c) => (
                    <div key={c._id} className="flex items-start gap-2.5">
                        <img
                            src={c.userId.avatar}
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="bg-slate-50 rounded-2xl px-3.5 py-2 flex-1">
                            <p className="text-xs font-semibold text-slate-800">
                                {c.userId.fullName}
                            </p>
                            <p className="text-sm text-slate-700">
                                {c.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </article>

            {/* Lightbox: enlarged photo with reactions + comment-only actions below,
                everything else blurred out behind it */}
            {isImageOpen && post?.pic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Blurred / dimmed backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
                        onClick={() => setIsImageOpen(false)}
                    />

                    {/* Modal content */}
                    <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                        {/* Close button */}
                        <button
                            onClick={() => setIsImageOpen(false)}
                            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80"
                        >
                            <X size={18} />
                        </button>

                        {/* Enlarged image */}
                        <div className="bg-black flex items-center justify-center max-h-[65vh]">
                            <img
                                src={post.pic}
                                alt="Post enlarged"
                                className="max-h-[65vh] w-full object-contain"
                            />
                        </div>

                        {/* Reactions + comments only, scrollable */}
                        <div className="flex flex-col overflow-y-auto">
                            <div className="flex items-center justify-between px-5 pt-4 text-xs text-slate-500">
                                <span>
                                    {post?.likesCount + post?.disLikesCount} reactions ·{" "}
                                    {post?.commentsCount} comments
                                </span>
                            </div>

                            <div className="flex items-center justify-between px-5 py-3">
                                <ReactionBar
                                    likes={post.likes}
                                    dislikes={post.dislikes}
                                    userVote={post.userVote}
                                    onVote={onVote}
                                />
                            </div>

                            <div className="h-px bg-slate-100 mx-5" />

                            {/* Comments list */}
                            <div className="px-5 py-4 space-y-3">
                                {postcomments?.map((c) => (
                                    <div key={c._id} className="flex items-start gap-2.5">
                                        <img
                                            src={c.userId.avatar}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="bg-slate-50 rounded-2xl px-3.5 py-2 flex-1">
                                            <p className="text-xs font-semibold text-slate-800">
                                                {c.userId.fullName}
                                            </p>
                                            <p className="text-sm text-slate-700">
                                                {c.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comment input pinned at bottom */}
                        <div className="flex items-center gap-2.5 px-5 py-3 border-t border-slate-100 bg-white">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 flex items-center bg-slate-50 rounded-full pl-3.5 pr-1.5 py-1 border border-slate-200 focus-within:ring-2 focus-within:ring-violet-300">
                                <input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    placeholder="Write a comment..."
                                    className="flex-1 bg-transparent text-sm outline-none placeholder-slate-400"
                                />
                                <button
                                    onClick={handleSubmit}
                                    className="p-1.5 rounded-full text-violet-600 hover:bg-violet-50"
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostCard;


// import React, { useState, useEffect } from "react";
// import {
//     MessageCircle,
//     Share2,
//     MoreHorizontal,
//     Send,
//     X,
// } from "lucide-react";
// import ReactionBar from "./ReactionBar";
// import { postAPI } from "../../api/api";
// import { useSelector } from "react-redux";
// import socket from "../../sockets/socket.js";

// const PostCard = ({ fullName, avatar, postDetails, postId }) => {
//     const [userId, setUserId] = useState("");
//     const { user } = useSelector((state) => state.user);
//     const [post, setPost] = useState(postDetails);
//     const [showComments, setShowComments] = useState(false);
//     const [commentText, setCommentText] = useState("");
//     const [isImageOpen, setIsImageOpen] = useState(false);
//     const [comments, setComments] = useState("");
//     const [postcomments, setPostComments] = useState([]);
//     const [name, setName] = useState("");
//     const [ownAvatar, setOwnAvatar] = useState("");

//     useEffect(() => {
//         if (!user) return;
//         const { _id, fullName, userName, avatar } = user;
//         setUserId(_id);
//         setName(fullName);
//         setOwnAvatar(avatar);
//     }, [user]);

//     // Lock background scroll while the lightbox is open
//     useEffect(() => {
//         document.body.style.overflow = isImageOpen ? "hidden" : "";
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [isImageOpen]);

//     const onVote = async (reaction, indicator) => {
//         if (reaction) {
//             const response = await postAPI.likePost(userId, postId, reaction, indicator);
//             if (response?.data) setPost(response?.data?.post);
//         }
//     };

//     useEffect(() => {
//         socket.emit("postViewers", userId)
//     }, [])

//     const handleSubmit = async () => {
//         if (!commentText.trim()) return;
//         socket.emit("WriteComment", { userId, postId, commentText })
//         // const response = await postAPI.addComment(userId, postId, commentText);
//         // if (response?.data?.post) setPost(response?.data?.post);
//         setPostComments((prev) => [
//             ...prev,
//             {
//                 comment: commentText,
//                 userId,
//                 name: name,
//                 avatar: ownAvatar,
//             },
//         ]);
//         setCommentText("");
//     };

//     useEffect(() => {
//         console.log("PCOMMENTS", postcomments);
//     }, [postcomments]);

//     useEffect(() => {
//         // socket.on("ReceiveComments", (comments) => {
//         //     setPostComments(comments);
//         // });
//         return () => {
//             socket.off("ReceiveComments")
//         };
//     }, []);

//     const initials = fullName
//         ?.split(" ")
//         .map((n) => n[0])
//         .join("")
//         .slice(0, 2)
//         .toUpperCase();

//     const zoomImage = () => {
//         setIsImageOpen(true);
//         socket.emit("getComments", postId);
//     }

//     useEffect(() => {
//         socket.on("ReceiveComments", (data) => {
//             console.log("Comments", data);
//             if (data.success) {
//                 setPostComments(data.comments);
//             }
//         });

//         return () => {
//             socket.off("ReceiveComments");
//         };
//     }, []);

//     return (
//         <>
//             <article className="bg-white rounded-2xl border border-slate-200 p-5">
//                 {/* Header */}
//                 <div className="flex items-start justify-between">
//                     <div className="flex items-center gap-3">
//                         <img
//                             src={avatar}
//                             alt=""
//                             className="w-11 h-11 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm shrink-0 object-cover"
//                         />
//                         <div>
//                             <p className="font-semibold text-slate-900 text-sm leading-tight">
//                                 {fullName}
//                             </p>
//                         </div>
//                     </div>
//                     <button className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100">
//                         <MoreHorizontal size={18} />
//                     </button>
//                 </div>

//                 {/* Content */}
//                 <p className="text-slate-800 text-[15px] leading-relaxed mt-3">
//                     {post.content}
//                 </p>

//                 {post?.pic && (
//                     <button
//                         type="button"
//                         onClick={zoomImage}
//                         className="mt-3 w-full block cursor-zoom-in"
//                     >
//                         <img
//                             src={post.pic}
//                             alt="Post"
//                             className="w-full max-h-[500px] object-cover rounded-xl border border-slate-200 hover:brightness-95 transition"
//                         />
//                     </button>
//                 )}

//                 {/* Stats row */}
//                 <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
//                     <span>
//                         {post?.likesCount + post?.disLikesCount} reactions ·{" "}
//                         {post?.commentsCount} comments
//                     </span>
//                 </div>

//                 <div className="h-px bg-slate-100 my-3" />

//                 {/* Actions */}
//                 <div className="flex items-center justify-between">
//                     <ReactionBar
//                         likes={post.likes}
//                         dislikes={post.dislikes}
//                         userVote={post.userVote}
//                         onVote={onVote}
//                     />
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => setShowComments((prev) => !prev)}
//                             className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-slate-600 hover:bg-slate-50 border border-slate-200"
//                         >
//                             <MessageCircle size={15} />
//                             <span className="font-medium">Comment</span>
//                         </button>
//                         <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-slate-600 hover:bg-slate-50 border border-slate-200">
//                             <Share2 size={15} />
//                             <span className="font-medium hidden sm:inline">Share</span>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Comments */}
//                 {postcomments?.map((c) => (
//                     <div key={c._id} className="flex items-start gap-2.5">
//                         <img
//                             src={c.userId.avatar}
//                             className="w-8 h-8 rounded-full"
//                         />
//                         <div className="bg-slate-50 rounded-2xl px-3.5 py-2 flex-1">
//                             <p className="text-xs font-semibold text-slate-800">
//                                 {c.userId.fullName}
//                             </p>
//                             <p className="text-sm text-slate-700">
//                                 {c.comment}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </article>

//             {/* Lightbox: enlarged photo with reactions + comment-only actions below,
//                 everything else blurred out behind it */}
//             {isImageOpen && post?.pic && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//                     {/* Blurred / dimmed backdrop */}
//                     <div
//                         className="absolute inset-0 bg-slate-900/70 backdrop-blur-md"
//                         onClick={() => setIsImageOpen(false)}
//                     />

//                     {/* Modal content */}
//                     <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl">
//                         {/* Close button */}
//                         <button
//                             onClick={() => setIsImageOpen(false)}
//                             className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80"
//                         >
//                             <X size={18} />
//                         </button>

//                         {/* Enlarged image */}
//                         <div className="bg-black flex items-center justify-center max-h-[65vh]">
//                             <img
//                                 src={post.pic}
//                                 alt="Post enlarged"
//                                 className="max-h-[65vh] w-full object-contain"
//                             />
//                         </div>

//                         {/* Reactions + comments only, scrollable */}
//                         <div className="flex flex-col overflow-y-auto">
//                             <div className="flex items-center justify-between px-5 pt-4 text-xs text-slate-500">
//                                 <span>
//                                     {post?.likesCount + post?.disLikesCount} reactions ·{" "}
//                                     {post?.commentsCount} comments
//                                 </span>
//                             </div>

//                             <div className="flex items-center justify-between px-5 py-3">
//                                 <ReactionBar
//                                     likes={post.likes}
//                                     dislikes={post.dislikes}
//                                     userVote={post.userVote}
//                                     onVote={onVote}
//                                 />
//                             </div>

//                             <div className="h-px bg-slate-100 mx-5" />

//                             {/* Comments list */}
//                             <div className="px-5 py-4 space-y-3">
//                                 {postcomments?.map((c) => (
//                                     <div key={c.userId} className="flex items-start gap-2.5">
//                                         <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold shrink-0">
//                                             {c.initials}
//                                         </div>
//                                         <div className="bg-slate-50 rounded-2xl px-3.5 py-2 flex-1">
//                                             <p className="text-xs font-semibold text-slate-800">
//                                                 {c.author}
//                                             </p>
//                                             <p className="text-sm text-slate-700">{c.text}</p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Comment input pinned at bottom */}
//                         <div className="flex items-center gap-2.5 px-5 py-3 border-t border-slate-100 bg-white">
//                             <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
//                                 {initials}
//                             </div>
//                             <div className="flex-1 flex items-center bg-slate-50 rounded-full pl-3.5 pr-1.5 py-1 border border-slate-200 focus-within:ring-2 focus-within:ring-violet-300">
//                                 <input
//                                     value={commentText}
//                                     onChange={(e) => setCommentText(e.target.value)}
//                                     onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
//                                     placeholder="Write a comment..."
//                                     className="flex-1 bg-transparent text-sm outline-none placeholder-slate-400"
//                                 />
//                                 <button
//                                     onClick={handleSubmit}
//                                     className="p-1.5 rounded-full text-violet-600 hover:bg-violet-50"
//                                 >
//                                     <Send size={15} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default PostCard;
