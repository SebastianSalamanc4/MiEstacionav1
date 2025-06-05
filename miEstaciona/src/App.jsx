import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ControlPanel from "./pages/ControlPanel";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NavBar from "./pages/NavBar";
import Register from "./pages/Register";
import Statistics from "./pages/Statistics";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/ControlPanel" element={<ControlPanel />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Statistics" element={<Statistics />} />
        <Route path="/UserProfile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
