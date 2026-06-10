import { useEffect, useState } from "react";
import { getBooks } from "../api/books";
import { requestBorrow } from "../api/borrowRequests";
import BookToolbar from "./BookToolbar";
import BookTable from "./BookTable";

const initialFilters = {
  search: "",
  category: "All categories",
  availability: "All availability"
};

export default function CatalogPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getBooks(filters)
      .then((result) => {
        if (!active) {
          return;
        }
        setBooks(result.books);
        setCategories(Array.from(new Set(result.books.map((book) => book.category))).sort());
      })
      .catch(() => {
        if (active) {
          setError("Catalog could not load. Check the API connection and try again.");
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
  }, [filters]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleRequest(bookId) {
    setError("");
    setMessage("");
    requestBorrow(bookId)
      .then(() => {
        setMessage("Borrow request submitted. Check My Requests for status updates.");
      })
      .catch((error) => {
        setError(error.message || "Could not submit borrow request.");
      });
  }

  return (
    <section>
      <h1 className="page-title">Catalog</h1>
      <BookToolbar
        search={filters.search}
        category={filters.category}
        availability={filters.availability}
        categories={categories}
        onSearchChange={(value) => updateFilter("search", value)}
        onCategoryChange={(value) => updateFilter("category", value)}
        onAvailabilityChange={(value) => updateFilter("availability", value)}
      />
      {loading ? (
        <p className="loading">Loading catalog...</p>
      ) : error ? (
        <p className="alert">{error}</p>
      ) : (
        <>
          {message ? <p className="alert" style={{ background: "#e1f3fb", borderColor: "#b6e0f4", color: "#176b87" }}>{message}</p> : null}
          <p>{books.length} books found</p>
          <BookTable books={books} onRequest={handleRequest} />
        </>
      )}
    </section>
  );
}
