import React, { useState, useEffect, useCallback } from "react";
import Flatpickr from "react-flatpickr";
import { Notyf } from "notyf";
import "flatpickr/dist/flatpickr.min.css";
import "notyf/notyf.min.css";
import EditModal from "../components/EditModal";

function Reports() {
  const clientName = localStorage.getItem("selectedClient") || "Unknown Client";
  const [dateRange, setDateRange] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalLog, setModalLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const notyf = new Notyf(); // Initialize Notyf

  const getDynamicText = () => {
    if (dateRange.length === 2 && dateRange[1]) {
      const fromDate = new Date(dateRange[0]).toLocaleDateString();
      const toDate = new Date(dateRange[1]).toLocaleDateString();

      if (timeLogs.length === 0) {
        return `No reports found for ${fromDate} - ${toDate}`;
      }
      return `Detailed Report for ${fromDate} - ${toDate}`;
    } else if (dateRange.length === 1) {
      return `Detailed Report for ${new Date(dateRange[0]).toLocaleDateString()}`;
    } else {
      return "Select a date range for the Detailed Report.";
    }
  };

  const fetchTimeLogs = useCallback(async () => {
    if (dateRange.length < 2) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    const DateFrom = dateRange[0].toISOString().split("T")[0];
    const DateTo = dateRange[1].toISOString().split("T")[0];

    try {
      const response = await fetch(
        `https://hours-app-server.onrender.com/time-logs?DateFrom=${DateFrom}&DateTo=${DateTo}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch time logs");
      }

      const data = await response.json();
      const filteredLogs = data.filter((log) => log.clientName === clientName);
      setTimeLogs(filteredLogs);
    } catch (error) {
      setError("Failed to fetch time logs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [dateRange, clientName]);

  useEffect(() => {
    fetchTimeLogs();
  }, [dateRange, fetchTimeLogs]);

  const handleEdit = (log) => {
    setModalLog(log);
    setShowModal(true);
  };

  const handleSave = async (log, newNote) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No authorization token found.");
      return;
    }

    const payload = {
      id: log.logId,
      userId: log.userId,
      projectId: log.projectId,
      taskId: log.taskId,
      note: newNote, // Update with the new note
      date: log.date,
      start: log.startTime,
      end: log.endTime,
      billable: log.billable,
      expense: log.expense,
    };

    try {
      const response = await fetch("https://hours-app-server.onrender.com/edit-log", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update the time log.");
      }

      // Update the log in the UI immediately
      setTimeLogs((prevLogs) =>
        prevLogs.map((logItem) =>
          logItem.logId === log.logId ? { ...logItem, note: newNote } : logItem
        )
      );

      notyf.success("Log updated successfully.");
    } catch (error) {
      notyf.error("Failed to update the log.");
      console.error(error.message);
    }
  };

  const handleDownloadReport = async () => {
    setDownloadLoading(true);
    try {
      const response = await fetch("https://hours-app-server.onrender.com/write-to-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "DETAILED REPORT", // Testing data
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to write to Google Sheet");
      }

      notyf.success("Data written to Google Sheet successfully!");
    } catch (error) {
      notyf.error("Failed to write to Google Sheet.");
      console.error("Error downloading report:", error.message);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Reports - {clientName}</h2>

      <div className="my-4 text-center">
        <h4>{getDynamicText()}</h4>
      </div>

      <div className="mb-4 d-flex justify-content-center">
        <Flatpickr
          className="flatpickr-input flatpickr-small"
          options={{
            mode: "range",
            dateFormat: "Y-m-d",
          }}
          onChange={(selectedDates) => setDateRange([...selectedDates])}
          placeholder="Select date range"
        />
      </div>

      {loading && (
        <div className="spinner-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && timeLogs.length > 0 && (
        <div className="text-center mb-3">
          <button className="btn btn-success" onClick={handleDownloadReport} disabled={downloadLoading}>
            {downloadLoading ? (
              <div className="spinner-border spinner-border-sm" role="status"></div>
            ) : (
              "Download Detailed Report"
            )}
          </button>
        </div>
      )}

      {!loading && timeLogs.length > 0 && (
        <div className="summary-section text-center mb-4">
          <p>
            Total Hours: {timeLogs.reduce((sum, log) => sum + log.laborHours, 0).toFixed(2)} hours |
            Total Billable Amount: £
            {timeLogs
              .reduce((sum, log) => sum + log.billableAmount, 0)
              .toLocaleString("en-GB")}
          </p>
        </div>
      )}

      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && timeLogs.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle mb-5">
            <thead className="table-dark text-center">
              <tr>
                <th>DATE</th>
                <th>USER</th>
                <th>CLIENT</th>
                <th>PROJECT</th>
                <th>TASK</th>
                <th>IS BILLABLE</th>
                <th>BILLABLE AMOUNT</th>
                <th>START/FINISH TIME</th>
                <th>TOTAL HOURS</th>
                <th>BILLABLE HOURS</th>
                <th>DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {timeLogs.map((log) => (
                <tr key={log.logId} className="text-center">
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{log.userName}</td>
                  <td>{log.clientName}</td>
                  <td>{log.projectName}</td>
                  <td>{log.taskName || "N/A"}</td>
                  <td>{log.billable ? "Billable" : "Not Billable"}</td>
                  <td>£{log.billableAmount.toFixed(2)}</td>
                  <td>{log.startEndTime || "-"}</td>
                  <td>{log.laborHours.toFixed(2)}</td>
                  <td>{log.billableHours.toFixed(2)}</td>
                  <td>
                    <div className="position-relative">
                      {log.note || "N/A"}
                      <div
                        className="edit-popover"
                        onClick={() => handleEdit(log)}
                      >
                        Edit
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EditModal
        show={showModal}
        onClose={() => setShowModal(false)}
        log={modalLog}
        onSave={handleSave}
      />
    </div>
  );
}

export default Reports;