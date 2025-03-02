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

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mode" element={<ModeSelection />} />
          <Route path="/solo" element={<SoloMode />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/Leaderboard" element={<Leaderboard />} />
          <Route path="/TwoPlayerGame" element={<TwoPlayerGame />} />

      


        </Routes>
      </div>
    </Router>
  );
}

export default App;
