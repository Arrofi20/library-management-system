export default function AppShell({ user, currentPage, onNavigate, onLogout, children }) {
  const studentLinks = [
    { label: "Dashboard", page: "Dashboard" },
    { label: "Catalog", page: "Catalog" },
    { label: "My Requests", page: "My Requests" },
    { label: "My Loans", page: "My Loans" }
  ];
  const librarianLinks = [
    { label: "Dashboard", page: "Dashboard" },
    { label: "Books", page: "Books" },
    { label: "Members", page: "Members" },
    { label: "Borrow Requests", page: "Borrow Requests" },
    { label: "Loans", page: "Loans" }
  ];
  const links = user.role === "librarian" ? librarianLinks : studentLinks;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Library Management System</p>
          <h1>{user.role === "librarian" ? "Librarian workspace" : "Student workspace"}</h1>
        </div>
        <button type="button" onClick={onLogout}>
          Log out
        </button>
      </header>
      <div className="workspace">
        <nav aria-label={`${user.role} navigation`}>
          {links.map((link) => (
            <button
              key={link.page}
              type="button"
              className={currentPage === link.page ? "active" : undefined}
              aria-current={currentPage === link.page ? "page" : undefined}
              onClick={() => onNavigate(link.page)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
}