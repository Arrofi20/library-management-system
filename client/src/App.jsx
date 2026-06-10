import { useEffect, useState } from "react";
import { getCurrentUser, getHealth, login, logout, registerStudent } from "./api/auth";
import AppShell from "./components/AppShell";
import Dashboard from "./components/Dashboard";
import CatalogPage from "./components/CatalogPage";
import BooksPage from "./components/BooksPage";
import MembersPage from "./components/MembersPage";
import MyRequestsPage from "./components/MyRequestsPage";
import BorrowRequestsPage from "./components/BorrowRequestsPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [health, setHealth] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const [healthStatus, session] = await Promise.allSettled([getHealth(), getCurrentUser()]);
        if (!active) {
          return;
        }
        if (healthStatus.status === "fulfilled") {
          setHealth(healthStatus.value);
        }
        if (session.status === "fulfilled") {
          setCurrentUser(session.value.user);
        } else {
          setMessage("Please log in to continue.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(credentials) {
    setLoginError("");
    try {
      const result = await login(credentials);
      setCurrentUser(result.user);
      setCurrentPage("Dashboard");
      setMessage("");
    } catch (error) {
      setLoginError(error.message);
    }
  }

  async function handleRegister(details) {
    setRegisterError("");
    try {
      const result = await registerStudent(details);
      setCurrentUser(result.user);
      setCurrentPage("Dashboard");
      setMessage("");
    } catch (error) {
      setRegisterError(error.message);
    }
  }

  async function handleLogout() {
    await logout();
    setCurrentUser(null);
    setCurrentPage("Dashboard");
    setMessage("You have been logged out.");
  }

  if (loading) {
    return <p className="loading">Loading library workspace...</p>;
  }

  if (currentUser) {
    return (
      <AppShell
        user={currentUser}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      >
        {currentPage === "Catalog" && currentUser.role === "student" ? (
          <CatalogPage />
        ) : currentPage === "My Requests" && currentUser.role === "student" ? (
          <MyRequestsPage />
        ) : currentPage === "Books" && currentUser.role === "librarian" ? (
          <BooksPage />
        ) : currentPage === "Members" && currentUser.role === "librarian" ? (
          <MembersPage />
        ) : currentPage === "Borrow Requests" && currentUser.role === "librarian" ? (
          <BorrowRequestsPage />
        ) : (
          <Dashboard user={currentUser} />
        )}
      </AppShell>
    );
  }

  return (
    <main className="auth-page">
      <section className="intro">
        <p className="eyebrow">University library</p>
        <h1>Library Management System</h1>
        <p>{message || "Log in or register as a student to start."}</p>
        <p className="system-status">API: {health?.ok ? "online" : "checking"} | Database: {health?.database || "checking"}</p>
      </section>
      <section className="auth-grid">
        <LoginForm onSubmit={handleLogin} error={loginError} />
        <RegisterForm onSubmit={handleRegister} error={registerError} />
      </section>
    </main>
  );
}
