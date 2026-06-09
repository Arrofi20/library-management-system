import { useState } from "react";

const demoCredentials = {
  student: {
    email: "student@example.edu",
    password: "student123"
  },
  librarian: {
    email: "librarian@example.edu",
    password: "librarian123"
  }
};

export default function LoginForm({ onSubmit, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function fillDemo(role) {
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].password);
  }

  function submit(event) {
    event.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form className="panel form" onSubmit={submit}>
      <div className="panel-heading">
        <h2>Log in</h2>
        <span>Demo access</span>
      </div>
      {error ? <p className="alert">{error}</p> : null}
      <div className="quick-fill" aria-label="Demo credential quick fill">
        <button type="button" onClick={() => fillDemo("student")}>
          Student demo
        </button>
        <button type="button" onClick={() => fillDemo("librarian")}>
          Librarian demo
        </button>
      </div>
      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
      </label>
      <label>
        Password
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
      </label>
      <button className="primary" type="submit">
        Log in
      </button>
      <p className="hint">Librarian accounts are seeded for demos and cannot be registered publicly.</p>
    </form>
  );
}
