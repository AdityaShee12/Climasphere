import ButtomNavbar from "../components/ButtomNavbar.jsx";
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