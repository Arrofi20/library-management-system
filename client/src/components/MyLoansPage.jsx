import { useEffect, useState } from "react";
import { getMyLoans } from "../api/loans";

export default function MyLoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getMyLoans()
      .then((result) => {
        if (!active) {
          return;
        }
        setLoans(result.loans);
      })
      .catch(() => {
        if (active) {
          setError("Could not load your loan history. Check the API connection and try again.");
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

  const activeLoans = loans.filter((loan) => loan.status === "active");
  const returnedLoans = loans.filter((loan) => loan.status === "returned");

  return (
    <section>
      <h1 className="page-title">My loans</h1>
      {loading ? (
        <p className="loading">Loading loan history...</p>
      ) : error ? (
        <p className="alert">{error}</p>
      ) : loans.length === 0 ? (
        <div className="panel">
          <h2>No loans yet</h2>
          <p>Once a librarian approves your request, active loans and returned history will appear here.</p>
        </div>
      ) : (
        <>
          <section className="loan-summary-grid">
            <article>
              <span>Active loans</span>
              <strong>{activeLoans.length}</strong>
            </article>
            <article>
              <span>Returned loans</span>
              <strong>{returnedLoans.length}</strong>
            </article>
          </section>
          <div className="table-wrapper">
            <table className="book-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Borrowed</th>
                  <th>Returned</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.bookTitle}</td>
                    <td>{loan.studentName}</td>
                    <td>{loan.status}</td>
                    <td>{new Date(loan.borrowedAt).toLocaleString()}</td>
                    <td>{loan.returnedAt ? new Date(loan.returnedAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
