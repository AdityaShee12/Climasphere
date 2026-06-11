import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Sign_up from "./components/Sign_up.jsx";
import Sign_in from "./components/Sign_in.jsx";
// import ChatLayout from "./Layout/ChatLayout.jsx"
import Post from "./components/Post.jsx";
import AnalystPortal from "./dataAnalystPortal/analystPortal.jsx";
import Download from "./Download/download.jsx";
import HomeLayout from "./Layout/HomeLayout.jsx";
// import ChatPage from "./services/ChatPage.jsx";
// import GroupSearch from "./services/groupSearch.service.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<Homepage />} />
        <Route path="post" element={<Post />} />
        {/* <Route path="chat" element={<ChatLayout />}>
          <Route path=":userName" element={<ChatPage />} />
          <Route path="group/:groupName" element={<GroupSearch />} />
        </Route> */}
      </Route>
      <Route path="/sign_up" element={<Sign_up />} />
      <Route path="/sign_in" element={<Sign_in />} />
      <Route path="/analyst_dashboard" element={<AnalystPortal />} />
      <Route path="/download" element={<Download />} />
    </Routes>
  );
}

export default App;