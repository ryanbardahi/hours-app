import React, { useEffect, useState } from "react";

function Clients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://hours-app-server.onrender.com/all-clients", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else {
          console.error("Failed to fetch clients.");
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Clients</h2>
      <div className="mt-3">
        {clients.map((client) => (
          <button
            key={client.id}
            className="btn btn-outline-primary m-2"
          >
            {client.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Clients;