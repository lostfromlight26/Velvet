const API_BASE_URL = "http://localhost:5000";

export async function apiGet(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

export async function apiPost(endpoint: string, body: unknown) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

export async function apiDelete(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}