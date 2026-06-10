import { requestJson } from "./auth";

export function getMyLoans() {
  return requestJson("/api/loans/my", { method: "GET" });
}

export function getLoans(filters = {}) {
  const params = new URLSearchParams();

  if (filters.member) {
    params.set("member", filters.member);
  }

  if (filters.book) {
    params.set("book", filters.book);
  }

  const query = params.toString();
  return requestJson(`/api/loans${query ? `?${query}` : ""}`);
}

export function returnLoan(id) {
  return requestJson(`/api/loans/${id}/return`, { method: "PUT" });
}
