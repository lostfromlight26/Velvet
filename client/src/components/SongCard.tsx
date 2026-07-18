import { Heart, Play } from "lucide-react";

import type { Song } from "../types/song";

import { usePlayerStore } from "../store/playerStore";
import { useFavoriteStore } from "../store/favoriteStore";

interface SongCardProps {
  song: Song;
}

function SongCard({ song }: SongCardProps) {
  const playSong = usePlayerStore((state) => state.playSong);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const toggleFavorite = useFavoriteStore(
    (state) => state.toggleFavorite
  );

  const isFavorite = useFavoriteStore((state) =>
    state.isFavorite(song.id)
  );

  const currentlyPlaying =
    currentSong?.id === song.id && isPlaying;

  return (
    <div
      className="
        group
        mb-4
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        px-4
        py-3
        transition-all
        duration-300
        hover:border-violet-500
        hover:bg-zinc-800
      "
    >
      <div className="flex items-center gap-4">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="h-16 w-16 rounded-xl object-cover"
        />

        <div>
          <h3 className="max-w-sm truncate font-semibold text-white">
            {song.title}
          </h3>

          <p className="mt-1 text-sm text-zinc-400">
            {song.artist}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => toggleFavorite(song)}
          className="text-zinc-400 transition hover:text-red-500"
        >
          <Heart
            size={22}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        <span className="text-sm text-zinc-400">
          {song.duration}
        </span>

        <button
          onClick={() => playSong(song)}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
            currentlyPlaying
              ? "bg-violet-500"
              : "bg-zinc-800 group-hover:bg-violet-500"
          }`}
        >
          <Play
            size={18}
            fill="white"
            className="ml-0.5 text-white"
          />
        </button>
      </div>
    </div>
  );
}

export default SongCard;