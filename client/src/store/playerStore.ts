import { create } from "zustand";
import {
  getStream,
  saveRecentSong,
} from "../services/musicService";
import type { Song } from "../types/song";

export type RepeatMode = "off" | "queue" | "one";

interface PlayerStore {
  currentSong: Song | null;
  recentSongs: Song[];
  queue: Song[];
  currentIndex: number;

  isPlaying: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isQueueOpen: boolean;

  currentTime: number;
  duration: number;
  volume: number;

  playbackProgress: Record<string, number>;

  audio: HTMLAudioElement;

  playSong: (song: Song, startTime?: number) => Promise<void>;
  playQueue: (songs: Song[], startIndex?: number) => Promise<void>;
  addToQueue: (song: Song) => void;
  playNextInQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  moveQueueItem: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  jumpToQueueIndex: (index: number) => Promise<void>;

  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  pauseSong: () => void;
  resumeSong: () => void;

  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;

  toggleShuffle: () => void;
  toggleRepeatMode: () => void;
  toggleQueuePanel: () => void;

  setRecentSongs: (songs: Song[]) => void;
}

const audio = new Audio();
audio.volume = 0.8;

const clientStreamCache = new Map<string, string>();

async function prefetchNextTrackStream(nextSong?: Song) {
  if (!nextSong || !nextSong.id || clientStreamCache.has(nextSong.id)) return;
  try {
    const res = await getStream(nextSong.id);
    if (res?.url) {
      clientStreamCache.set(nextSong.id, res.url);
    }
  } catch (err) {
    // Silent ignore prefetch failure
  }
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
  audio.addEventListener("timeupdate", () => {
    const { currentSong } = get();
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;

    set((state) => {
      // Throttle updates if change is sub-100ms and duration is unchanged
      if (Math.abs(state.currentTime - cur) < 0.1 && state.duration === dur) {
        return state;
      }

      const prevProg = currentSong ? state.playbackProgress[currentSong.id] : undefined;
      const progressChanged = currentSong && cur > 0 && Math.abs((prevProg || 0) - cur) > 0.5;

      return {
        currentTime: cur,
        duration: dur,
        playbackProgress: progressChanged
          ? { ...state.playbackProgress, [currentSong!.id]: cur }
          : state.playbackProgress,
      };
    });
  });

  audio.addEventListener("ended", () => {
    get().playNext();
  });

  return {
    currentSong: null,
    recentSongs: [],
    queue: [],
    currentIndex: -1,

    isPlaying: false,
    isShuffle: false,
    repeatMode: "off",
    isQueueOpen: false,

    currentTime: 0,
    duration: 0,
    volume: 0.8,
    playbackProgress: {},
    audio,

    async playSong(song, startTime) {
      try {
        let streamUrl = clientStreamCache.get(song.id);

        if (!streamUrl) {
          const response = await getStream(song.id);
          streamUrl = response.url;
          if (streamUrl) {
            clientStreamCache.set(song.id, streamUrl);
          }
        }

        if (streamUrl) {
          audio.src = streamUrl;
          if (startTime && startTime > 0) {
            audio.currentTime = startTime;
          }
          await audio.play();
        }

        try {
          await saveRecentSong({
            youtubeId: song.id,
            title: song.title,
            artist: song.artist,
            thumbnail: song.thumbnail,
            duration: song.duration,
          });
        } catch (error) {
          console.error("Failed to save recent song", error);
        }

        const filtered = get().recentSongs.filter(
          (s) => s.id !== song.id
        );

        set({
          currentSong: song,
          isPlaying: true,
          recentSongs: [song, ...filtered].slice(0, 20),
        });

        // Trigger background prefetch for next song in queue
        const { queue, currentIndex } = get();
        if (queue.length > 0 && currentIndex >= 0 && currentIndex < queue.length - 1) {
          prefetchNextTrackStream(queue[currentIndex + 1]);
        }
      } catch (err) {
        console.error("Error playing song", err);
      }
    },

    async playQueue(songs, startIndex = 0) {
      if (!songs || songs.length === 0) return;
      set({ queue: songs, currentIndex: startIndex });
      const targetSong = songs[startIndex];
      if (targetSong) {
        await get().playSong(targetSong);
      }
    },

    addToQueue(song) {
      const { queue, currentSong, playSong } = get();
      const updatedQueue = [...queue, song];
      set({ queue: updatedQueue });

      // If no song playing, play immediately
      if (!currentSong) {
        set({ currentIndex: updatedQueue.length - 1 });
        playSong(song);
      }
    },

    playNextInQueue(song) {
      const { queue, currentIndex, currentSong, playSong } = get();
      if (!currentSong || currentIndex === -1) {
        set({ queue: [song, ...queue], currentIndex: 0 });
        playSong(song);
        return;
      }
      const updatedQueue = [...queue];
      updatedQueue.splice(currentIndex + 1, 0, song);
      set({ queue: updatedQueue });
    },

    removeFromQueue(index) {
      const { queue, currentIndex } = get();
      const updatedQueue = queue.filter((_, i) => i !== index);
      let nextIndex = currentIndex;
      if (index < currentIndex) {
        nextIndex = Math.max(0, currentIndex - 1);
      } else if (index === currentIndex) {
        nextIndex = Math.min(currentIndex, updatedQueue.length - 1);
      }
      set({ queue: updatedQueue, currentIndex: updatedQueue.length === 0 ? -1 : nextIndex });
    },

    moveQueueItem(fromIndex, toIndex) {
      const { queue, currentIndex } = get();
      if (
        fromIndex < 0 ||
        fromIndex >= queue.length ||
        toIndex < 0 ||
        toIndex >= queue.length
      )
        return;

      const updatedQueue = [...queue];
      const [movedItem] = updatedQueue.splice(fromIndex, 1);
      updatedQueue.splice(toIndex, 0, movedItem);

      let newCurrentIndex = currentIndex;
      if (currentIndex === fromIndex) {
        newCurrentIndex = toIndex;
      } else if (currentIndex > fromIndex && currentIndex <= toIndex) {
        newCurrentIndex -= 1;
      } else if (currentIndex < fromIndex && currentIndex >= toIndex) {
        newCurrentIndex += 1;
      }

      set({ queue: updatedQueue, currentIndex: newCurrentIndex });
    },

    clearQueue() {
      set({ queue: [], currentIndex: -1, currentSong: null, isPlaying: false });
      audio.pause();
      audio.src = "";
    },

    async jumpToQueueIndex(index) {
      const { queue, playSong } = get();
      if (index < 0 || index >= queue.length) return;
      set({ currentIndex: index });
      await playSong(queue[index]);
    },

    async playNext() {
      const { queue, currentIndex, isShuffle, repeatMode, playSong } = get();
      if (queue.length === 0) return;

      // Repeat One
      if (repeatMode === "one" && audio.src) {
        audio.currentTime = 0;
        await audio.play();
        set({ isPlaying: true });
        return;
      }

      // Shuffle
      if (isShuffle && queue.length > 1) {
        let randomIndex = Math.floor(Math.random() * queue.length);
        if (randomIndex === currentIndex) {
          randomIndex = (currentIndex + 1) % queue.length;
        }
        set({ currentIndex: randomIndex });
        await playSong(queue[randomIndex]);
        return;
      }

      // Sequential
      if (currentIndex < queue.length - 1) {
        const nextIndex = currentIndex + 1;
        set({ currentIndex: nextIndex });
        await playSong(queue[nextIndex]);
      } else if (repeatMode === "queue") {
        set({ currentIndex: 0 });
        await playSong(queue[0]);
      } else {
        set({ isPlaying: false });
      }
    },

    async playPrevious() {
      const { queue, currentIndex, repeatMode, playSong } = get();

      // Restart song if playback > 3 seconds
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        set({ currentTime: 0 });
        return;
      }

      if (queue.length === 0) return;

      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        set({ currentIndex: prevIndex });
        await playSong(queue[prevIndex]);
      } else if (repeatMode === "queue") {
        const lastIndex = queue.length - 1;
        set({ currentIndex: lastIndex });
        await playSong(queue[lastIndex]);
      } else {
        audio.currentTime = 0;
        set({ currentTime: 0 });
      }
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

    toggleShuffle() {
      set((state) => ({ isShuffle: !state.isShuffle }));
    },

    toggleRepeatMode() {
      set((state) => {
        const modes: RepeatMode[] = ["off", "queue", "one"];
        const nextIdx = (modes.indexOf(state.repeatMode) + 1) % modes.length;
        return { repeatMode: modes[nextIdx] };
      });
    },

    toggleQueuePanel() {
      set((state) => ({ isQueueOpen: !state.isQueueOpen }));
    },

    setRecentSongs(songs) {
      set({
        recentSongs: songs,
      });
    },
  };
});