import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

function jsonResponse(body, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("auth flow", () => {
  it("shows login when no session exists", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
      if (url === "/api/health") {
        return jsonResponse({ ok: true, database: "available" });
      }
      return jsonResponse({ message: "Please log in to continue." }, 401);
    });

    render(<App />);

    expect(await screen.findByText("Please log in to continue.")).toBeInTheDocument();
    expect(screen.getByText("API: online | Database: available")).toBeInTheDocument();
  });

  it("quick-fills seeded student credentials and logs in", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url, options = {}) => {
      if (url === "/api/health") {
        return jsonResponse({ ok: true, database: "available" });
      }
      if (url === "/api/auth/me") {
        return jsonResponse({ message: "Please log in to continue." }, 401);
      }
      if (url === "/api/auth/login" && options.method === "POST") {
        return jsonResponse({
          user: {
            name: "Demo Student",
            memberId: "STU-1001",
            email: "student@example.edu",
            role: "student"
          }
        });
      }
      return jsonResponse({}, 404);
    });

    render(<App />);
    await screen.findByText("Student demo");

    await userEvent.click(screen.getByText("Student demo"));
    expect(screen.getByLabelText("Email")).toHaveValue("student@example.edu");

    await userEvent.click(screen.getByText("Log in"));

    expect(await screen.findByText("Student workspace")).toBeInTheDocument();
    expect(screen.getByText("Catalog")).toBeInTheDocument();
    expect(screen.queryByText("Members")).not.toBeInTheDocument();
  });

  it("quick-fills seeded librarian credentials and shows librarian navigation", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url, options = {}) => {
      if (url === "/api/health") {
        return jsonResponse({ ok: true, database: "available" });
      }
      if (url === "/api/auth/me") {
        return jsonResponse({ message: "Please log in to continue." }, 401);
      }
      if (url === "/api/auth/login" && options.method === "POST") {
        return jsonResponse({
          user: {
            name: "Demo Librarian",
            memberId: "LIB-0001",
            email: "librarian@example.edu",
            role: "librarian"
          }
        });
      }
      return jsonResponse({}, 404);
    });

    render(<App />);
    await screen.findByText("Librarian demo");

    await userEvent.click(screen.getByText("Librarian demo"));
    await userEvent.click(screen.getByText("Log in"));

    expect(await screen.findByText("Librarian workspace")).toBeInTheDocument();
    expect(screen.getByText("Members")).toBeInTheDocument();
    expect(screen.queryByText("My loans")).not.toBeInTheDocument();
  });

  it("registers a student and auto-enters the dashboard", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url, options = {}) => {
      if (url === "/api/health") {
        return jsonResponse({ ok: true, database: "available" });
      }
      if (url === "/api/auth/me") {
        return jsonResponse({ message: "Please log in to continue." }, 401);
      }
      if (url === "/api/auth/register" && options.method === "POST") {
        return jsonResponse({
          user: {
            name: "New Student",
            memberId: "STU-2002",
            email: "new.student@example.edu",
            role: "student"
          }
        });
      }
      return jsonResponse({}, 404);
    });

    render(<App />);
    await screen.findByText("Student registration");

    const registration = screen.getByText("Student registration").closest("form");
    await userEvent.type(within(registration).getByLabelText("Name"), "New Student");
    await userEvent.type(within(registration).getByLabelText("Member ID"), "STU-2002");
    await userEvent.type(within(registration).getByLabelText("Email"), "new.student@example.edu");
    await userEvent.type(within(registration).getByLabelText("Password"), "password123");
    await userEvent.click(screen.getByText("Register and enter"));

    expect(await screen.findByText("Welcome, New Student")).toBeInTheDocument();
    expect(screen.getByText("STU-2002")).toBeInTheDocument();
  });

  it("logs out and returns to login", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url, options = {}) => {
      if (url === "/api/health") {
        return jsonResponse({ ok: true, database: "available" });
      }
      if (url === "/api/auth/me") {
        return jsonResponse({
          user: {
            name: "Demo Student",
            memberId: "STU-1001",
            email: "student@example.edu",
            role: "student"
          }
        });
      }
      if (url === "/api/auth/logout" && options.method === "POST") {
        return jsonResponse({ ok: true });
      }
      return jsonResponse({}, 404);
    });

    render(<App />);
    expect(await screen.findByText("Student workspace")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Log out"));

    await waitFor(() => expect(screen.getByText("You have been logged out.")).toBeInTheDocument());
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });
});
