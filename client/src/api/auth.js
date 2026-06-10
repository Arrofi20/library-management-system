export async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function getHealth() {
  return requestJson("/api/health", { method: "GET" });
}

export function getCurrentUser() {
  return requestJson("/api/auth/me", { method: "GET" });
}

export function login(credentials) {
  return requestJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function registerStudent(details) {
  return requestJson("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(details)
  });
}

export function logout() {
  return requestJson("/api/auth/logout", { method: "POST" });
}
