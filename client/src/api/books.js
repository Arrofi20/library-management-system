import { requestJson } from "./auth";

export function getBooks(filters = {}) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }
  if (filters.category) {
    params.set("category", filters.category);
  }
  if (filters.availability) {
    params.set("availability", filters.availability);
  }

  const query = params.toString();
  return requestJson(`/api/books${query ? `?${query}` : ""}`);
}

export function createBook(payload) {
  return requestJson("/api/books", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateBook(id, payload) {
  return requestJson(`/api/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function deleteBook(id) {
  return requestJson(`/api/books/${id}`, {
    method: "DELETE"
  });
}
