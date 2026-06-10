export default function BookToolbar({ search, category, availability, categories, onSearchChange, onCategoryChange, onAvailabilityChange }) {
  return (
    <div className="toolbar">
      <label>
        Search catalog
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title, author, category, or ISBN"
          type="search"
        />
      </label>
      <label>
        Category
        <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option>All categories</option>
          {categories.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label>
        Availability
        <select value={availability} onChange={(event) => onAvailabilityChange(event.target.value)}>
          <option>All availability</option>
          <option>Available</option>
          <option>Unavailable</option>
        </select>
      </label>
    </div>
  );
}
