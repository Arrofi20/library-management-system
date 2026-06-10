import { useEffect, useState } from "react";

export default function BookForm({ book, onSave, onCancel, error, success }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    isbn: "",
    availability: "Available"
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        category: book.category,
        isbn: book.isbn,
        availability: book.available ? "Available" : "Unavailable"
      });
      return;
    }

    setForm({ title: "", author: "", category: "", isbn: "", availability: "Available" });
  }, [book]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSave({
      title: form.title,
      author: form.author,
      category: form.category,
      isbn: form.isbn,
      available: form.availability === "Available" ? 1 : 0
    });
  }

  return (
    <form className="panel form" onSubmit={submit}>
      <div className="panel-heading">
        <h2>{book ? "Edit book" : "Add book"}</h2>
        <span>{book ? "Update book details" : "Create a new catalog record"}</span>
      </div>
      {error ? <p className="alert">{error}</p> : null}
      {success ? <p className="alert" style={{ background: "#e1f3fb", borderColor: "#b6e0f4", color: "#176b87" }}>{success}</p> : null}
      <label>
        Title
        <input value={form.title} onChange={(event) => update("title", event.target.value)} required />
      </label>
      <label>
        Author
        <input value={form.author} onChange={(event) => update("author", event.target.value)} required />
      </label>
      <label>
        Category
        <input value={form.category} onChange={(event) => update("category", event.target.value)} required />
      </label>
      <label>
        ISBN
        <input
          value={form.isbn}
          onChange={(event) => update("isbn", event.target.value)}
          required
          disabled={book && !book.available}
        />
      </label>
      {book && !book.available ? (
        <p className="small-hint">ISBN cannot be changed while this book is unavailable or on loan.</p>
      ) : null}
      <label>
        Availability
        <select
          value={form.availability}
          onChange={(event) => update("availability", event.target.value)}
        >
          <option>Available</option>
          <option>Unavailable</option>
        </select>
      </label>
      <div className="form-actions">
        <button className="primary" type="submit">
          {book ? "Update book" : "Save book"}
        </button>
        {book ? (
          <button type="button" onClick={onCancel}>
            Discard book edits
          </button>
        ) : null}
      </div>
    </form>
  );
}
