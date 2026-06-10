import { requestJson } from "./auth";

export function getMyRequests() {
  return requestJson("/api/borrow-requests/my", { method: "GET" });
}

export function requestBorrow(bookId) {
  return requestJson("/api/borrow-requests", {
    method: "POST",
    body: JSON.stringify({ bookId })
  });
}

export function getPendingRequests() {
  return requestJson("/api/borrow-requests/pending", { method: "GET" });
}

export function approveRequest(id) {
  return requestJson(`/api/borrow-requests/${id}/approve`, { method: "PUT" });
}

export function rejectRequest(id, note) {
  return requestJson(`/api/borrow-requests/${id}/reject`, {
    method: "PUT",
    body: JSON.stringify({ note })
  });
}
