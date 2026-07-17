import React, { useState } from "react";
import {
    Home,
    Users,
    PlusSquare,
    Bell,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const CURRENT_USER = { name: "Aditya Rao", initials: "AR" };
    const navigate = useNavigate();
    const active = (key) => {
        if (key === "create") {
            navigate("/postLayout/createPost");
        }
    }

    const navItem = (key, label, Icon) => (
        <button
            onClick={() => active(key)}
            className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${active === key
                ? "text-violet-600"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
        >
            <Icon size={20} strokeWidth={active === key ? 2.4 : 2} />
            <span className="mt-0.5">{label}</span>
        </button>
    );

    return (
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
                        C
                    </div>
                    <span className="font-semibold text-slate-900 text-lg tracking-tight hidden sm:block">
                        Circle
                    </span>
                </div>

                <div className="flex-1 max-w-md mx-6 hidden md:block">
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Search people, posts..."
                            className="w-full bg-slate-100 rounded-full pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-300"
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-1">
                    {navItem("home", "Home", Home)}
                    {navItem("friends", "Friends", Users)}
                    {navItem("create", "Post", PlusSquare)}
                    {navItem("alerts", "Alerts", Bell)}
                </nav>

                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold ml-2 shrink-0">
                    {CURRENT_USER.initials}
                </div>
            </div>
        </header>
    );
}

export default Navbar;