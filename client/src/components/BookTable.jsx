function AvailabilityBadge({ available }) {
  return (
    <span className={`status-badge ${available ? "available" : "unavailable"}`}>
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

export default function BookTable({ books, onEdit, onDelete, showActions = false, blockedMessage }) {
  if (books.length === 0) {
    return (
      <div className="book-panel">
        <h2>No books match your search</h2>
        <p>Clear the search or filters to view the full catalog.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>ISBN</th>
            <th>Availability</th>
            {showActions ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.isbn}</td>
              <td>
                <AvailabilityBadge available={book.available} />
              </td>
              {showActions ? (
                <td>
                  <button type="button" onClick={() => onEdit(book)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={!book.available}
                    onClick={() => onDelete(book)}
                  >
                    Delete
                  </button>
                  {!book.available ? <p className="small-hint">This book cannot be deleted because it has an active loan.</p> : null}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
      {blockedMessage ? <p className="alert">{blockedMessage}</p> : null}
    </div>
  );
}
