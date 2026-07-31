import { create } from "zustand";
import {
  getPlaylists,
  getPlaylistById,
  createPlaylist as createPlaylistApi,
  renamePlaylist as renamePlaylistApi,
  deletePlaylist as deletePlaylistApi,
  addSongToPlaylist as addSongToPlaylistApi,
  removeSongFromPlaylist as removeSongFromPlaylistApi,
} from "../services/playlistService";
import type { Playlist } from "../types/playlist";
import type { Song } from "../types/song";

interface PlaylistStore {
  playlists: Playlist[];
  activePlaylist: Playlist | null;
  loading: boolean;
  error: string | null;

  loadPlaylists: () => Promise<void>;
  loadPlaylistDetails: (id: number | string) => Promise<Playlist | null>;
  createPlaylist: (name: string) => Promise<Playlist | null>;
  renamePlaylist: (id: number | string, name: string) => Promise<void>;
  deletePlaylist: (id: number | string) => Promise<void>;
  addSongToPlaylist: (playlistId: number | string, song: Song) => Promise<void>;
  removeSongFromPlaylist: (
    playlistId: number | string,
    songId: string
  ) => Promise<void>;
  clearActivePlaylist: () => void;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlists: [],
  activePlaylist: null,
  loading: false,
  error: null,

  async loadPlaylists() {
    set({ loading: true, error: null });
    try {
      const response = await getPlaylists();
      set({ playlists: response.data || [], loading: false });
    } catch (err: any) {
      console.error("Failed to load playlists", err);
      set({ error: "Failed to load playlists", loading: false });
    }
  },

  async loadPlaylistDetails(id) {
    set({ loading: true, error: null });
    try {
      const response = await getPlaylistById(id);
      const playlist: Playlist = response.data;
      set({ activePlaylist: playlist, loading: false });
      return playlist;
    } catch (err: any) {
      console.error("Failed to load playlist details", err);
      set({ error: "Failed to load playlist details", loading: false });
      return null;
    }
  },

  async createPlaylist(name) {
    try {
      const response = await createPlaylistApi(name);
      const newPlaylist: Playlist = response.data;
      set((state) => ({
        playlists: [...state.playlists, newPlaylist],
      }));
      return newPlaylist;
    } catch (err: any) {
      console.error("Failed to create playlist", err);
      throw err;
    }
  },

  async renamePlaylist(id, name) {
    try {
      const response = await renamePlaylistApi(id, name);
      const updatedPlaylist: Playlist = response.data;
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p.id === Number(id) ? updatedPlaylist : p
        ),
        activePlaylist:
          state.activePlaylist?.id === Number(id)
            ? updatedPlaylist
            : state.activePlaylist,
      }));
    } catch (err: any) {
      console.error("Failed to rename playlist", err);
      throw err;
    }
  },

  async deletePlaylist(id) {
    try {
      await deletePlaylistApi(id);
      set((state) => ({
        playlists: state.playlists.filter((p) => p.id !== Number(id)),
        activePlaylist:
          state.activePlaylist?.id === Number(id)
            ? null
            : state.activePlaylist,
      }));
    } catch (err: any) {
      console.error("Failed to delete playlist", err);
      throw err;
    }
  },

  async addSongToPlaylist(playlistId, song) {
    try {
      await addSongToPlaylistApi(playlistId, song);
      // Reload playlists or update active playlist if open
      const { activePlaylist, loadPlaylistDetails, loadPlaylists } = get();
      await loadPlaylists();
      if (activePlaylist && activePlaylist.id === Number(playlistId)) {
        await loadPlaylistDetails(playlistId);
      }
    } catch (err: any) {
      console.error("Failed to add song to playlist", err);
      throw err;
    }
  },

  async removeSongFromPlaylist(playlistId, songId) {
    try {
      await removeSongFromPlaylistApi(playlistId, songId);
      const { activePlaylist, loadPlaylistDetails, loadPlaylists } = get();
      await loadPlaylists();
      if (activePlaylist && activePlaylist.id === Number(playlistId)) {
        await loadPlaylistDetails(playlistId);
      }
    } catch (err: any) {
      console.error("Failed to remove song from playlist", err);
      throw err;
    }
  },

  clearActivePlaylist() {
    set({ activePlaylist: null });
  },
}));
