import React, { useEffect, useState } from "react";

function Clients() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await fetch("https://hours-app-server.onrender.com/all-clients", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "api-version": "1.0",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
        } else {
          setError("Failed to fetch clients. Please try again later.");
        }
      } catch {
        setError("An error occurred while fetching clients.");
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Clients</h2>
      {error && <p className="text-danger">{error}</p>}
      <div className="mt-3">
        {clients.map((client) => (
          <button key={client.id} className="btn btn-outline-primary m-2">
            {client.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Clients;
