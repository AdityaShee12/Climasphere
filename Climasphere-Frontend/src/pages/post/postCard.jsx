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
import ReactionBar from "./ReactionBar";

const PostCard = ({ fullName, avatar, post }) => {
    return (
        <article className="bg-white rounded-2xl border border-slate-200 p-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <img src={avatar} alt="" className="w-11 h-11 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-semibold text-sm shrink-0" />
                    <div className="">
                        <p className="font-semibold text-slate-900 text-sm leading-tight">
                            {fullName}
                        </p>
                        <p className="text-xs text-slate-500">
                            {post.handle} · {post.time}
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
                <img
                    src={post?.pic}
                    alt="Post"
                    className="mt-3 w-full max-h-[500px] object-cover rounded-xl border border-slate-200"
                />
            )}

            {/* Stats row */}
            <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                <span>
                    {post?.likesCount + post?.disLikesCount} reactions · {post?.commentsCount}{" "}
                    comments
                </span>
            </div>

            <div className="h-px bg-slate-100 my-3" />

            {/* Actions */}
            <div className="flex items-center justify-between">
                <ReactionBar
                    likes={post.likes}
                    dislikes={post.dislikes}
                    userVote={post.userVote}
                    onVote={(dir) => onVote(post.id, dir)}
                />
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onToggleComments(post.id)}
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
            {post.showComments && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    {post.comments.map((c) => (
                        <div key={c.id} className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold shrink-0">
                                {c.initials}
                            </div>
                            <div className="bg-slate-50 rounded-2xl px-3.5 py-2 flex-1">
                                <p className="text-xs font-semibold text-slate-800">
                                    {c.author}
                                </p>
                                <p className="text-sm text-slate-700">{c.text}</p>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center gap-2.5 pt-1">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                            {CURRENT_USER.initials}
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
            )}
        </article>
    );
}

export default PostCard;