import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Homepage from "../pages/home/Homepage.jsx";
import Sign_up from "../pages/auth/Sign_up.jsx";
import Sign_in from "../pages/auth/Sign_in.jsx";
import Download from "../Download/download.jsx";
import DataAnalystPortal from "../dataAnalystPortal/DataAnalystPortal.jsx";
import HomeLayout from "../Layout/HomeLayout.jsx";
import ChatLayout from "../Layout/ChatLayout.jsx";
import ChatService from "../services/chat.service.jsx";

const App = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Homepage />} />
        {/* <Route path="post" element={<Post />} /> */}
      </Route>
      <Route path="/chatLayout" element={<ChatLayout />}>
        <Route path="chat/:userName" element={<ChatService />} />
      </Route>
      <Route path="/sign_up" element={<Sign_up />} />
      <Route path="/sign_in" element={<Sign_in />} />
      <Route path="/analyst_dashboard" element={<DataAnalystPortal />} />
      <Route path="/download" element={<Download />} />
    </>,
  ),
);

export default App;
