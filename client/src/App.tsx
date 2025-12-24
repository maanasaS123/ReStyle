import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Closet from "./pages/Closet";
import Generate from "./pages/Generate";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/closet" />} />
          <Route path="/closet" element={<Closet />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
