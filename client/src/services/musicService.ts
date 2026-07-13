import { apiGet } from "./api";

export async function searchSongs(query: string) {
  return apiGet(`/api/search?q=${encodeURIComponent(query)}`);
}

export async function getStream(videoId: string) {
  return apiGet(`/api/stream/${videoId}`);
}