import { requestJson } from "./auth";

export function getMembers() {
  return requestJson("/api/members", { method: "GET" });
}

export function createMember(payload) {
  return requestJson("/api/members", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateMember(id, payload) {
  return requestJson(`/api/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
