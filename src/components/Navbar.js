import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token"); // Check if a token exists

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand ms-lg-5" to="/">
          my-hours.
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-5">
            {/* Show Clients link only if logged in */}
            {isLoggedIn && location.pathname !== "/clients" && (
              <li className="nav-item">
                <Link className="nav-link" to="/clients">
                  Clients
                </Link>
              </li>
            )}
            {/* Show Logout link only if logged in */}
            {isLoggedIn && location.pathname !== "/" && (
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;