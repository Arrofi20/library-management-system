import { useEffect, useState } from "react";
import { getPendingRequests, approveRequest, rejectRequest } from "../api/borrowRequests";
import RequestRow from "./RequestRow";

export default function BorrowRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  function loadRequests() {
    setLoading(true);
    setError("");
    setActionMessage("");
    getPendingRequests()
      .then((result) => {
        setRequests(result.requests);
      })
      .catch(() => {
        setError("Pending requests could not load. Check the API connection and try again.");
      })
      .finally(() => setLoading(false));
  }

  function handleApprove(id) {
    setActionMessage("");
    approveRequest(id)
      .then(() => {
        setActionMessage("Request approved.");
        loadRequests();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleReject(id) {
    const note = window.prompt("Enter an optional rejection note:");
    if (note === null) {
      return;
    }

    setActionMessage("");
    rejectRequest(id, note)
      .then(() => {
        setActionMessage("Request rejected.");
        loadRequests();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <section>
      <h1 className="page-title">Borrow requests</h1>
      {loading ? (
        <p className="loading">Loading requests...</p>
      ) : error ? (
        <p className="alert">{error}</p>
      ) : (
        <>
          {actionMessage ? <p className="alert" style={{ background: "#e1f3fb", borderColor: "#b6e0f4", color: "#176b87" }}>{actionMessage}</p> : null}
          {requests.length === 0 ? (
            <div className="panel">
              <h2>No pending requests</h2>
              <p>Pending borrow requests will appear here for review.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Requested</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <RequestRow
                      key={request.id}
                      request={request}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
