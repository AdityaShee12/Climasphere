import ButtomNavbar from "../components/ButtomNavbar";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div>
            <Outlet />
            <ButtomNavbar />
        </div>
    );
}

export default HomeLayout;