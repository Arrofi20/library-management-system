import React from "react";
import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

const sampleBooks = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", isbn: "9780132350884", available: true },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Software Engineering", isbn: "9780201616224", available: false }
];

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

describe("catalog and books pages", () => {
  it("renders the student Catalog page with search and availability badges", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url, options = {}) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/api/health") {
        return jsonResponse({ ok: true, database: "available" });
      }
      if (requestUrl.pathname === "/api/auth/me") {
        return jsonResponse({ user: { name: "Demo Student", memberId: "STU-1001", email: "student@example.edu", role: "student" } });
      }
      if (requestUrl.pathname === "/api/books") {
        return jsonResponse({ books: sampleBooks });
      }
      return jsonResponse({}, 404);
    });

    render(<App />);
    await screen.findByText("Catalog");
    await userEvent.click(screen.getByRole("button", { name: "Catalog" }));

    expect(await screen.findByRole("heading", { name: "Catalog" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Search catalog/i)).toBeInTheDocument();
    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    const cleanCodeRow = screen.getByText("Clean Code").closest("tr");
    expect(within(cleanCodeRow).getByText("Available")).toBeInTheDocument();
    const pragmaticRow = screen.getByText("The Pragmatic Programmer").closest("tr");
    expect(within(pragmaticRow).getByText("Unavailable")).toBeInTheDocument();
  });

  it("renders the librarian Books page and disables delete for unavailable books", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((url, options = {}) => {
      const requestUrl = new URL(url, "http://localhost");
      if (requestUrl.pathname === "/api/health") {
        return jsonResponse({ ok: true, database: "available" });
      }
      if (requestUrl.pathname === "/api/auth/me") {
        return jsonResponse({ user: { name: "Demo Librarian", memberId: "LIB-0001", email: "librarian@example.edu", role: "librarian" } });
      }
      if (requestUrl.pathname === "/api/books") {
        return jsonResponse({ books: sampleBooks });
      }
      return jsonResponse({}, 404);
    });

    render(<App />);
    await screen.findByText("Books");
    await userEvent.click(screen.getByRole("button", { name: "Books" }));

    expect(await screen.findByRole("heading", { name: "Books" })).toBeInTheDocument();
    expect(screen.getByText("Add book")).toBeInTheDocument();
    const unavailableRow = screen.getByText("The Pragmatic Programmer").closest("tr");
    expect(within(unavailableRow).getByRole("button", { name: /delete/i })).toBeDisabled();
    expect(within(unavailableRow).getByText("This book cannot be deleted because it has an active loan.")).toBeInTheDocument();
  });
});
