import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/user-login");
  };

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <nav className="lernx-navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <span className="logo-icon">L</span>
          <span className="logo-text">Learn<span className="logo-highlight">exa</span></span>
        </Link>

        {/* Hamburger Toggle */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Navigation">
          <span className={`hamburger ${isOpen ? "open" : ""}`}></span>
        </button>

        {/* Center Links & Right Actions */}
        <div className={`navbar-menu ${isOpen ? "is-active" : ""}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive("/")}`} onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className={`nav-link ${isActive("/courses")}`}
                onClick={() => {
                  sessionStorage.removeItem("courses_state");
                  setIsOpen(false);
                }}
              >
                Courses
              </Link>
            </li>
            <li>
              <Link to="/events" className={`nav-link ${isActive("/events")}`} onClick={() => setIsOpen(false)}>
                Events
              </Link>
            </li>
          </ul>

          <div className="auth-buttons">
            {user ? (
              <div className="user-profile-menu">
                <Link to="/profile" className="profile-icon-btn" title="View Profile" onClick={() => setIsOpen(false)}>
                  <svg className="avatar-svg" viewBox="0 0 24 24" width="32" height="32">
                    <circle cx="12" cy="12" r="10" fill="#e0e7ff" />
                    <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#4f46e5" />
                    <circle cx="12" cy="9" r="4" fill="#4f46e5" />
                  </svg>
                </Link>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="guest-menu">
                <Link to="/user-login" className="btn-login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/create-account" className="btn-signup" onClick={() => setIsOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
