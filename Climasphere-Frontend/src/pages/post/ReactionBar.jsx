import React, { useState } from "react";
import {
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { postAPI } from "../../api/api";
import Navbar from "./PostNavbar";
import PostCard from "./postCard";

const ReactionBar = ({ likes, dislikes, userVote, onVote }) => {

    const [like, setLike] = useState(false);
    const [disLike, setDislike] = useState(false);

    const likeSystem = () => {
        if (like) {
            onVote("up", 0);
            setLike(false);
        } else {
            onVote("up", 1);
            setLike(true);
            setDislike(false);
        }
    }

    const disLikeSystem = () => {
        if (disLike) {
            onVote("down", 0);
            setDislike(false);
        } else {
            onVote("down", 1);
            setDislike(true);
            setLike(false);
        }
    }

    return (
        <div className="inline-flex items-center rounded-full border border-slate-200 overflow-hidden text-sm">
            <button
                onClick={likeSystem}
                className={"flex items-center gap-1.5 px-3 py-1.5"}
            >
                {like ? (<FaThumbsUp size={15} />) : (<ThumbsUp size={15} />)}
            </button >
            <div className="w-px h-4 bg-slate-200" />
            <button
                onClick={disLikeSystem}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${userVote === "down"
                    ? "bg-rose-50 text-rose-700"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
            >
                {disLike ? (<FaThumbsDown size={15} />) : (<ThumbsDown size={15} />)}
            </button>
        </div >
    );
}

export default ReactionBar;