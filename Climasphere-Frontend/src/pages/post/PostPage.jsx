import { useRef, useState, useEffect } from "react";
import { postAPI } from "../../api/api";
import Navbar from "./PostNavbar";
import PostCard from "./postCard.jsx";
import { useSelector } from "react-redux";;

const PostPage = () => {

    const CURRENT_USER = { name: "Aditya Rao", initials: "AR" };
    const [posts, setPosts] = useState([]);
    const { user } = useSelector(
        (state) => state.user,
    );
    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState();
    const [avatar, setAvatar] = useState("");
    const postRef = useRef();
    const timerRef = useRef();

    // Access the redux store of this app
    useEffect(() => {
        if (!user) return;
        const { _id, email, fullName, userName, avatar } = user;
        setUserId(_id);
        setAvatar(avatar);
        setFullName(fullName);
        setEmail(email);
        setUserName(userName);
    }, [user]);

    // Get random post
    useEffect(() => {
        const fetchPost = async () => {
            if (userId) {
                const photo = await postAPI.getPost();
                setPosts(photo);
                console.log("Photo", photo);
            }
        }
        fetchPost();
    }, [userId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    entry.intersectionRatio >= 0.5
                ) {
                    timerRef.current = setTimeout(async () => {
                        await postAPI.addView({
                            postId,
                            photoId,
                            userId
                        });
                    }, 3000);
                } else {
                    clearTimeout(timerRef.current);
                }
            },
            {
                threshold: 0.5
            }
        );
        if (postRef.current) {
            observer.observe(postRef.current);
        }
        return () => {
            clearTimeout(timerRef.current);
            observer.disconnect();
        };
    }, []);

    const handleVote = (postId, direction) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;

                let { likes, dislikes, userVote } = p;

                if (direction === "up") {
                    if (userVote === "up") {
                        likes -= 1;
                        userVote = null;
                    } else {
                        likes += 1;
                        if (userVote === "down") dislikes -= 1;
                        userVote = "up";
                    }
                } else {
                    if (userVote === "down") {
                        dislikes -= 1;
                        userVote = null;
                    } else {
                        dislikes += 1;
                        if (userVote === "up") likes -= 1;
                        userVote = "down";
                    }
                }

                return { ...p, likes, dislikes, userVote };
            })
        );
    };

    const handleToggleComments = (postId) => {
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId ? { ...p, showComments: !p.showComments } : p
            )
        );
    };

    const handleAddComment = (postId, text) => {
        setPosts((prev) =>
            prev.map((p) => {
                if (p.id !== postId) return p;
                const newComment = {
                    id: p.comments.length + 1,
                    author: CURRENT_USER.name,
                    initials: CURRENT_USER.initials,
                    text,
                };
                return { ...p, comments: [...p.comments, newComment], showComments: true };
            })
        );
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Navbar />

            <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
                {/* Create post shortcut */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0">
                        {CURRENT_USER?.initials}
                    </div>
                    <button className="flex-1 text-left text-sm text-slate-400 bg-slate-900 border border-slate-700 rounded-full px-4 py-2.5 hover:border-slate-500 hover:text-slate-300 transition-colors">
                        What's on your mind, {CURRENT_USER.name.split(" ")[0]}?
                    </button>
                </div>

                {posts?.data?.map((post) => (
                    <PostCard
                        fullName={post?.userId?.fullName}
                        avatar={post?.userId?.avatar}
                        postDetails={post?.post}
                        postId={post?._id}
                    />
                ))}
            </main>
        </div>
    );
}

export default PostPage;

// return (
//         <div className="min-h-screen bg-slate-50">
//             <Navbar />

//             <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
//                 {/* Create post shortcut */}
//                 <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
//                         {CURRENT_USER?.initials}
//                     </div>
//                     <button className="flex-1 text-left text-sm text-slate-400 bg-slate-100 rounded-full px-4 py-2.5 hover:bg-slate-200 transition-colors">
//                         What's on your mind, {CURRENT_USER.name.split(" ")[0]}?
//                     </button>
//                 </div>

//                 {posts?.data?.map((post) => (
//                     <PostCard
//                         fullName={post?.userId?.fullName}
//                         avatar={post?.userId?.avatar}
//                         postDetails={post?.post}
//                         postId={post?._id}
//                     />
//                 ))}
//             </main>
//         </div>
//     );