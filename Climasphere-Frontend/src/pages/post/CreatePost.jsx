import { useState, useEffect, useRef } from "react";
import {
    X,
    Globe,
    Image as ImageIcon,
    Smile,
    MapPin,
} from "lucide-react";
import { postAPI } from "../../api/api.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ onClose, onSubmit }) => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [audience, setAudience] = useState("Public");
    const fileInputRef = useRef(null);
    const { user } = useSelector(
        (state) => state.user,
    );
    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState();
    const [avatar, setAvatar] = useState("");
    const [pic, setPic] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;
        const { _id, email, fullName, userName, avatar, about } = user;
        console.log("ID", _id);
        setUserId(_id);
        setAvatar(avatar);
        setFullName(fullName);
        setEmail(email);
        setUserName(userName);
    }, [user]);

    const handlePost = async () => {
        const trimmed = text.trim();
        if (!trimmed && !pic) return;
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("trimmed", trimmed);
        formData.append("imagePreview", pic);

        const uploadPost = await postAPI.createPost(formData);

        if (uploadPost?.data) {
            navigate("/postLayout")
        }
    };

    const CURRENT_USER = { name: "Aditya Rao", initials: "AR" };

    return (
        <div className="fixed inset-0 z-30 flex items-start sm:items-center justify-center bg-black/50 p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="relative flex items-center justify-center border-b border-slate-200 py-3.5 px-4 shrink-0">
                    <h2 className="font-semibold text-slate-900 text-base">
                        Create post
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-4 py-4">
                    {/* Author row */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                            {CURRENT_USER.initials}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm leading-tight">
                                {CURRENT_USER.name}
                            </p>
                            <button
                                onClick={() =>
                                    setAudience(audience === "Public" ? "Friends" : "Public")
                                }
                                className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 rounded-full px-2 py-0.5 mt-0.5 hover:bg-slate-200"
                            >
                                <Globe size={11} />
                                {audience}
                            </button>
                        </div>
                    </div>

                    {/* Text area */}
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        autoFocus
                        placeholder={`What's on your mind, ${CURRENT_USER.name.split(" ")[0]}?`}
                        className="w-full resize-none outline-none text-[17px] placeholder-slate-400 text-slate-800 min-h-[110px] leading-relaxed"
                    />

                    {/* Image preview */}
                    {pic && (
                        <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200">
                            <button
                                onClick={() => setImagePreview(null)}
                                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/75"
                            >
                                <X size={14} />
                            </button>
                            <img
                                src={URL.createObjectURL(pic)}
                                alt="Selected upload preview"
                                className="w-full max-h-80 object-cover"
                            />
                        </div>
                    )}

                    {/* Add to post row */}
                    <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 mt-4">
                        <span className="text-sm font-medium text-slate-700">
                            Add to your post
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50"
                            >
                                <ImageIcon size={20} />
                            </button>
                            <button className="p-2 rounded-full text-amber-500 hover:bg-amber-50">
                                <Smile size={20} />
                            </button>
                            <button className="p-2 rounded-full text-rose-500 hover:bg-rose-50">
                                <MapPin size={20} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPic(e.target.files[0])}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3.5 border-t border-slate-100 shrink-0">
                    <button
                        onClick={handlePost}
                        disabled={!text.trim() && !imagePreview}
                        className="w-full rounded-xl py-2.5 font-semibold text-sm text-white bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;