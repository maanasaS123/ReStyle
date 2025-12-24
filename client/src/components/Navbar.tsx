import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; // optional, for styling in CSS file

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link
        to="/closet"
        className={`nav-link ${location.pathname === "/closet" ? "active" : ""}`}
      >
        Closet
      </Link>
      <Link
        to="/generate"
        className={`nav-link ${location.pathname === "/generate" ? "active" : ""}`}
      >
        Generate Outfit
      </Link>
    </nav>
  );
};

export default Navbar;
