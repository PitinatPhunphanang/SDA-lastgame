import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // นำเข้าการใช้งาน Router
import Home from './Home';
import ModeSelection from './Mode';
import SoloMode from './Solo';
import Matching from './Matching';
import SignUp from './signup';
import Signin from './signin';
import Leaderboard from './Leaderboard';
import TwoPlayerGame from './TwoPlayerGame';
import ProtectedRoute from "./ProtectedRoute"; // Import Protected Route
import Profile from './profile';
import GlobalChat from './Globalchat';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* หน้าที่ยอมให้ทุกคนเข้าถึงได้ */}
          <Route path="/" element={<Home />} />
          <Route path="/mode" element={<ModeSelection />} />
          <Route path="/solo" element={<SoloMode />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/TwoPlayerGame" element={<TwoPlayerGame />} />

          {/* Protected Routes (เฉพาะผู้ที่ล็อกอินเท่านั้น) */}
          <Route element={<ProtectedRoute />}>
          <Route path="/globalchat" element={<GlobalChat />} />
          <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
