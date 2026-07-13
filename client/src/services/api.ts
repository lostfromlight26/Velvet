const API_BASE_URL = "http://localhost:5000";

export async function apiGet(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}