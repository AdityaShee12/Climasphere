import React, { useState } from "react";
import {
    Home,
    Users,
    PlusSquare,
    Bell,
    Search,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    Share2,
    MoreHorizontal,
    Send,
} from "lucide-react";
import { postAPI } from "../../api/api";
import Navbar from "./PostNavbar";
import PostCard from "./postCard";

const ReactionBar = ({ likes, dislikes, userVote, onVote }) => {
    return (
        <div className="inline-flex items-center rounded-full border border-slate-200 overflow-hidden text-sm">
            <button
                onClick={() => onVote("up")}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${userVote === "up"
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
            >
                <ThumbsUp size={15} strokeWidth={userVote === "up" ? 2.4 : 2} />
                <span className="font-medium">{likes}</span>
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <button
                onClick={() => onVote("down")}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${userVote === "down"
                    ? "bg-rose-50 text-rose-700"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
            >
                <ThumbsDown size={15} strokeWidth={userVote === "down" ? 2.4 : 2} />
                <span className="font-medium">{dislikes}</span>
            </button>
        </div>
    );
}

export default ReactionBar;