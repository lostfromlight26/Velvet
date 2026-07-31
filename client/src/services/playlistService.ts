import { apiDelete, apiGet, apiPost, apiPut } from "./api";
import type { Song } from "../types/song";

export async function getPlaylists() {
  return apiGet("/api/playlists");
}

export async function getPlaylistById(id: number | string) {
  return apiGet(`/api/playlists/${id}`);
}

export async function createPlaylist(name: string, folderId?: number) {
  return apiPost("/api/playlists", { name, folderId });
}

export async function renamePlaylist(id: number | string, name: string) {
  return apiPut(`/api/playlists/${id}`, { name });
}

export async function deletePlaylist(id: number | string) {
  return apiDelete(`/api/playlists/${id}`);
}

export async function addSongToPlaylist(playlistId: number | string, song: Song) {
  return apiPost(`/api/playlists/${playlistId}/songs`, {
    youtubeId: song.id,
    title: song.title,
    artist: song.artist,
    thumbnail: song.thumbnail,
    duration: song.duration,
  });
}

export async function removeSongFromPlaylist(
  playlistId: number | string,
  songId: string
) {
  return apiDelete(`/api/playlists/${playlistId}/songs/${songId}`);
}
