import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand ms-5" to="/">
          my-hours.
        </Link>
        {/* Hide Logout button on the Login page */}
        {location.pathname !== "/" && (
          <button className="btn btn-outline-danger me-5" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;