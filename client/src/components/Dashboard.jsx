export default function Dashboard({ user }) {
  if (user.role === "librarian") {
    return (
      <section className="dashboard">
        <h2>Welcome, {user.name}</h2>
        <div className="status-grid">
          <article>
            <span>Catalog</span>
            <strong>Seed books ready</strong>
          </article>
          <article>
            <span>Members</span>
            <strong>Student records next</strong>
          </article>
          <article>
            <span>Requests</span>
            <strong>Approval workflow pending</strong>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <h2>Welcome, {user.name}</h2>
      <div className="status-grid">
        <article>
          <span>Member ID</span>
          <strong>{user.memberId}</strong>
        </article>
        <article>
          <span>Catalog</span>
          <strong>Search arrives next</strong>
        </article>
        <article>
          <span>Loans</span>
          <strong>No active loans yet</strong>
        </article>
      </div>
    </section>
  );
}
