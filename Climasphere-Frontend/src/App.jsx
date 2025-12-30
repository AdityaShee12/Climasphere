import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Sign_up from "./components/Sign_up.jsx";
import Sign_in from "./components/Sign_in.jsx";
import { Messaging } from "./Messaging/Messaging.jsx";
import { Post } from "./Post/Post.jsx";
import AnalystPortal from "./dataAnalystPortal/analystPortal.jsx";
import Download from "./Download/download.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/sign_up" element={<Sign_up />} />
      <Route path="/sign_in" element={<Sign_in />} />
      <Route path="/post" element={<Post />} />
      <Route path="/messaging" element={<Messaging />} />
      <Route path="/analyst_dashboard" element={<AnalystPortal />} />
      <Route path="/download" element={<Download />} />
    </Routes>
  );
}

export default App;
