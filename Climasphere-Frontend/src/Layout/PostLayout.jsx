import ButtomNavbar from "../components/ButtomNavbar";
import { Outlet } from "react-router-dom";

const PostLayout = () => {
    return (
        <div>
            <Outlet />
        </div>
    );
}

export default PostLayout;