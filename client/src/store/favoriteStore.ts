import { create } from "zustand";

import {
  getFavorites,
  saveFavorite,
  deleteFavorite,
} from "../services/musicService";

import type { Song } from "../types/song";

interface FavoriteStore {
  favorites: Song[];

  loadFavorites: () => Promise<void>;

  isFavorite: (youtubeId: string) => boolean;

  toggleFavorite: (song: Song) => Promise<void>;
}

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],

  async loadFavorites() {
    try {
      const response = await getFavorites();

      const favorites: Song[] = response.data.map((song: any) => ({
        id: song.youtubeId,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
        duration: song.duration,
        isFavorite: true,
      }));

      set({
        favorites,
      });
    } catch (error) {
      console.error("Failed to load favorites", error);
    }
  },

  isFavorite(youtubeId) {
    return get().favorites.some(
      (song) => song.id === youtubeId
    );
  },

  async toggleFavorite(song) {
    const exists = get().favorites.some(
      (favorite) => favorite.id === song.id
    );

    if (exists) {
      await deleteFavorite(song.id);

      set({
        favorites: get().favorites.filter(
          (favorite) => favorite.id !== song.id
        ),
      });

      return;
    }

    await saveFavorite({
      youtubeId: song.id,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      duration: song.duration,
    });

    set({
      favorites: [
        {
          ...song,
          isFavorite: true,
        },
        ...get().favorites,
      ],
    });
  },
}));