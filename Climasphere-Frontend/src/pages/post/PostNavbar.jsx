import React, { useState, useEffect } from "react";
import {
    Home,
    Users,
    PlusSquare,
    Bell,
    Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {

    const navigate = useNavigate();
    const { user } = useSelector(
        (state) => state.user,
    );
    const [avatar, setAvatar] = useState("");

    useEffect(() => {
        if (!user) return;
        const { _id, avatar } = user;
        console.log("ID", _id);
        setAvatar(avatar);
    }, [user]);

    const active = (key) => {
        if (key === "home") {
            navigate("/postLayout");
        }
        else if (key === "create") {
            navigate("/postLayout/createPost");
        }
        else if (key === "create") {

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
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
            <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-sm">
                        C
                    </div>
                    <span className="font-extrabold text-orange-400 text-lg tracking-tight hidden sm:block select-none">
                        ClimaSphere
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
                            className="w-full bg-slate-800 border border-slate-700 rounded-full pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-slate-500 transition-colors"
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-1">
                    {navItem("home", "Home", Home)}
                    {navItem("friends", "Friends", Users)}
                    {navItem("create", "Post", PlusSquare)}
                </nav>

                <img
                    src={avatar}
                    className="w-8 h-8 rounded-full"
                />
            </div>
        </header>
    );
}

export default Navbar;