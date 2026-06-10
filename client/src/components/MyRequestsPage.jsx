import { useEffect, useState } from "react";
import { getMyRequests } from "../api/borrowRequests";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getMyRequests()
      .then((result) => {
        if (!active) {
          return;
        }
        setRequests(result.requests);
      })
      .catch(() => {
        if (active) {
          setError("Could not load your requests. Check the API connection and try again.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section>
      <h1 className="page-title">My requests</h1>
      {loading ? (
        <p className="loading">Loading requests...</p>
      ) : error ? (
        <p className="alert">{error}</p>
      ) : requests.length === 0 ? (
        <div className="panel">
          <h2>No requests yet</h2>
          <p>Request an available book from the catalog to get started.</p>
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
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.bookTitle}</td>
                  <td>{request.studentName}</td>
                  <td>{request.status}</td>
                  <td>{new Date(request.requestedAt).toLocaleString()}</td>
                  <td>{request.rejectedNote || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
