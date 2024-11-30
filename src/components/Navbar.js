import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand ms-5" to="/">
          my-hours.
        </Link>
        {location.pathname !== "/clients" && (
          <Link className="nav-link me-5" to="/clients">
            Clients
          </Link>
        )}
        {location.pathname !== "/" && (
          <Link className="nav-link me-5" to="/" onClick={handleLogout}>
            Logout
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;