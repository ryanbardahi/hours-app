import React from "react";
import { Link } from "react-router-dom";

function Reports() {
  const clientName = localStorage.getItem("selectedClient");

  return (
    <div className="container mt-5">
      <h2>Reports - {clientName}</h2>
      <Link to="/clients" className="nav-link mt-3">
        Back to Clients
      </Link>
    </div>
  );
}

export default Reports;
