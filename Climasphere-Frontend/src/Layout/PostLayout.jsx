import Navbar from "../pages/post/PostNavbar";
import { Outlet } from "react-router-dom";

const PostLayout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}

export default PostLayout;