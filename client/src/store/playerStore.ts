import { create } from "zustand";
import { getStream } from "../services/musicService";
import type { Song } from "../types/song";

interface PlayerStore {
  currentSong: Song | null;
  recentSongs: Song[];

  isPlaying: boolean;

  currentTime: number;
  duration: number;

  volume: number;

  audio: HTMLAudioElement;

  playSong: (song: Song) => Promise<void>;
  pauseSong: () => void;
  resumeSong: () => void;

  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
  const audio = new Audio();

  audio.volume = 0.8;

  audio.addEventListener("timeupdate", () => {
    set({
      currentTime: audio.currentTime,
      duration: audio.duration || 0,
    });
  });

  audio.addEventListener("ended", () => {
    set({
      isPlaying: false,
    });
  });

  return {
    currentSong: null,

    recentSongs: [],

    isPlaying: false,

    currentTime: 0,

    duration: 0,

    volume: 0.8,

    audio,

    async playSong(song) {
      const response = await getStream(song.id);

      audio.src = response.url;

      await audio.play();

      const filtered = get().recentSongs.filter(
        (s) => s.id !== song.id
      );

      set({
        currentSong: song,

        isPlaying: true,

        recentSongs: [song, ...filtered].slice(0, 20),
      });
    },

    pauseSong() {
      audio.pause();

      set({
        isPlaying: false,
      });
    },

    resumeSong() {
      audio.play();

      set({
        isPlaying: true,
      });
    },

    seekTo(time) {
      audio.currentTime = time;

      set({
        currentTime: time,
      });
    },

    setVolume(volume) {
      audio.volume = volume;

      set({
        volume,
      });
    },
  };
});