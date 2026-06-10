import { useEffect, useState } from "react";
import { getLoans, returnLoan } from "../api/loans";
import LoanRow from "./LoanRow";

const initialFilters = {
  member: "",
  book: ""
};

export default function LoansPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    loadLoans();
  }, []);

  function loadLoans() {
    setLoading(true);
    setError("");
    setActionMessage("");

    getLoans(filters)
      .then((result) => {
        setLoans(result.loans);
      })
      .catch(() => {
        setError("Loan records could not load. Check the API connection and try again.");
      })
      .finally(() => setLoading(false));
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleReturn(id) {
    setError("");
    setActionMessage("");

    returnLoan(id)
      .then(() => {
        setActionMessage("Loan marked as returned.");
        loadLoans();
      })
      .catch((error) => {
        setError(error.message || "Could not return the loan. Try again.");
      });
  }

  return (
    <section>
      <h1 className="page-title">Loans</h1>
      <div className="filter-row">
        <label>
          Member search
          <input
            value={filters.member}
            onChange={(event) => updateFilter("member", event.target.value)}
            placeholder="Member name"
          />
        </label>
        <label>
          Book search
          <input
            value={filters.book}
            onChange={(event) => updateFilter("book", event.target.value)}
            placeholder="Book title"
          />
        </label>
        <button type="button" onClick={loadLoans}>
          Search
        </button>
      </div>
      {loading ? (
        <p className="loading">Loading loans...</p>
      ) : error ? (
        <p className="alert">{error}</p>
      ) : (
        <>
          {actionMessage ? <p className="alert" style={{ background: "#e1f3fb", borderColor: "#b6e0f4", color: "#176b87" }}>{actionMessage}</p> : null}
          {loans.length === 0 ? (
            <div className="panel">
              <h2>No loans found</h2>
              <p>Use the filters to view active loans and loan history by member or book.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Borrowed</th>
                    <th>Returned</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <LoanRow key={loan.id} loan={loan} onReturn={handleReturn} />
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
