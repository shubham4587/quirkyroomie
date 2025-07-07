import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComplaintList from "./pages/ComplaintList";
import Leaderboard from "./pages/Leaderboard";
import Stats from "./pages/Stats";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/complain" element={<ComplaintList />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
