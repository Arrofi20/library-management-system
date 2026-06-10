import { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook } from "../api/books";
import BookToolbar from "./BookToolbar";
import BookTable from "./BookTable";
import BookForm from "./BookForm";

const initialFilters = {
  search: "",
  category: "All categories",
  availability: "All availability"
};

export default function BooksPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    loadBooks();
  }, [filters]);

  function buildCategories(bookList) {
    const all = Array.from(new Set(bookList.map((book) => book.category))).sort();
    setCategories(all);
  }

  function loadBooks() {
    setLoading(true);
    setError("");
    getBooks(filters)
      .then((result) => {
        setBooks(result.books);
        buildCategories(result.books);
      })
      .catch(() => {
        setError("Catalog could not load. Check the API connection and try again.");
      })
      .finally(() => setLoading(false));
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleSave(payload) {
    setFormError("");
    setFormSuccess("");

    const action = selectedBook ? updateBook(selectedBook.id, payload) : createBook(payload);

    action
      .then(() => {
        setFormSuccess(selectedBook ? "Book updated." : "Book added.");
        setSelectedBook(null);
        loadBooks();
      })
      .catch((error) => {
        setFormError(error.message);
      });
  }

  function handleDelete(book) {
    if (!book.available) {
      setError("This book cannot be deleted because it has an active loan.");
      return;
    }

    const confirmed = window.confirm(
      "Delete book: Delete this book? This permanently removes it from the catalog and cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    deleteBook(book.id)
      .then(() => {
        setFormSuccess("Book deleted.");
        loadBooks();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  function handleEdit(book) {
    setFormError("");
    setFormSuccess("");
    setSelectedBook(book);
  }

  function handleCancel() {
    setFormError("");
    setFormSuccess("");
    setSelectedBook(null);
  }

  return (
    <section className="book-page-grid">
      <div>
        <h1 className="page-title">Books</h1>
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
          <p className="loading">Loading books...</p>
        ) : error ? (
          <p className="alert">{error}</p>
        ) : (
          <>
            <p>{books.length} books found</p>
            <BookTable books={books} showActions onEdit={handleEdit} onDelete={handleDelete} />
          </>
        )}
      </div>
      <BookForm
        book={selectedBook}
        onSave={handleSave}
        onCancel={handleCancel}
        error={formError}
        success={formSuccess}
      />
    </section>
  );
}
