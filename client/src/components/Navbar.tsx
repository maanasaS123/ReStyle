import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/closet" className="navbar-logo">
          ReStyle
        </Link>

        <Link
          to="/closet"
          className={`nav-link ${location.pathname === "/closet" ? "active" : ""}`}
        >
          <b>Closet</b>
        </Link>

        <Link
          to="/generate"
          className={`nav-link ${location.pathname === "/generate" ? "active" : ""}`}
        >
          <b>Generate Outfit</b>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
