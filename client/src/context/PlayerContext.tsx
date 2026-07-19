import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { getStream } from "../services/musicService";
import type { Song } from "../types/song";

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;

  currentTime: number;
  duration: number;

  queue: Song[];
  currentIndex: number;

  playSong: (song: Song) => Promise<void>;
  pauseSong: () => void;
  resumeSong: () => void;

  seekTo: (time: number) => void;

  setQueue: (songs: Song[]) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;

  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ===== Queue =====
  const [queue, setQueueState] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = async () => {
      if (currentIndex < queue.length - 1) {
        await playNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, queue]);

  async function playSong(song: Song) {
    try {
      const response = await getStream(song.id);

      if (!audioRef.current) return;

      audioRef.current.src = response.url;

      await audioRef.current.play();

      setCurrentSong(song);
      setIsPlaying(true);

      // Update current index if song is inside queue
      const index = queue.findIndex((s) => s.id === song.id);

      if (index !== -1) {
        setCurrentIndex(index);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to play song");
    }
  }

  function pauseSong() {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  }

  function resumeSong() {
    if (!audioRef.current) return;

    audioRef.current.play();
    setIsPlaying(true);
  }

  function seekTo(time: number) {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function setQueue(songs: Song[]) {
    setQueueState(songs);
  }

  async function playNext() {
    if (currentIndex >= queue.length - 1) return;

    const nextIndex = currentIndex + 1;

    setCurrentIndex(nextIndex);

    await playSong(queue[nextIndex]);
  }

  async function playPrevious() {
    if (currentIndex <= 0) return;

    const prevIndex = currentIndex - 1;

    setCurrentIndex(prevIndex);

    await playSong(queue[prevIndex]);
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,

        currentTime,
        duration,

        queue,
        currentIndex,

        playSong,
        pauseSong,
        resumeSong,

        seekTo,

        setQueue,
        playNext,
        playPrevious,

        audioRef,
      }}
    >
      {children}

      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }

  return context;
}