import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Sign_up from "./components/Sign_up.jsx";
import Sign_in from "./components/Sign_in.jsx";
import Dashboard from "./dataAnalystPortal/analystPortal.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/sign_up" element={<Sign_up />} />
      <Route path="/sign_in" element={<Sign_in />} />
      <Route path="/analyst_dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
