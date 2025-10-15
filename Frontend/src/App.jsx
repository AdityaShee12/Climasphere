import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Sign_up from "./components/Sign_up.jsx";
import Sign_in from "./components/Sign_in.jsx";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />{" "}
        <Route path="/sign_up" element={<Sign_up />} />{" "}
        <Route path="/sign_in" element={<Sign_in />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
