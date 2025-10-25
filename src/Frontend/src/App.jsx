import React from "react";
import Sidebar from "./pages/sidebar";
import Main from "./pages/main";
import "./App.css"; 

const App = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <Main />
    </div>
  );
};

export default App;
