import { apiGet, apiPost } from "./api";

export async function searchSongs(query: string) {
  return apiGet(`/api/search?q=${encodeURIComponent(query)}`);
}

export async function getStream(videoId: string) {
  return apiGet(`/api/stream/${videoId}`);
}

export async function getRecentSongs() {
  return apiGet("/api/recent");
}

export async function saveRecentSong(song: {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
}) {
  return apiPost("/api/recent", song);
}