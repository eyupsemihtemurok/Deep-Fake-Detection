import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./pages/sidebar";
import Main from "./pages/main";
import History from "./pages/history";
import Twitter from "./pages/twitter";
import VideoLibrary from "./pages/VideoLibrary";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/history" element={<History />} />
            <Route path="/twitter" element={<Twitter />} />
            <Route path="/video-library" element={<VideoLibrary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
