import { useState, useMemo } from "react";
import { Heart, Play, Shuffle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFavoriteStore } from "../store/favoriteStore";
import { usePlayerStore } from "../store/playerStore";
import SongCard from "../components/SongCard";
import EmptyState from "../components/ui/EmptyState";

export default function LikedSongsPage() {
  const navigate = useNavigate();
  const { favorites } = useFavoriteStore();
  const { playQueue, toggleShuffle } = usePlayerStore();

  const [filterQuery, setFilterQuery] = useState("");

  const filteredSongs = useMemo(() => {
    if (!filterQuery.trim()) return favorites;
    const query = filterQuery.toLowerCase();
    return favorites.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.artist.toLowerCase().includes(query)
    );
  }, [favorites, filterQuery]);

  const handlePlayAll = () => {
    if (favorites.length === 0) return;
    playQueue(favorites, 0);
  };

  const handleShufflePlay = () => {
    if (favorites.length === 0) return;
    const { isShuffle } = usePlayerStore.getState();
    if (!isShuffle) {
      toggleShuffle();
    }
    const randomIndex = Math.floor(Math.random() * favorites.length);
    playQueue(favorites, randomIndex);
  };

  return (
    <div className="min-h-full pb-44 p-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_0_40px_rgba(239,68,68,0.12)] mb-8">
        <div className="h-44 w-44 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 shadow-2xl flex items-center justify-center">
          <Heart size={64} fill="white" className="text-white animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
            Playlist
          </p>
          <h1 className="text-4xl font-extrabold text-white mt-1">Liked Songs</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {favorites.length} {favorites.length === 1 ? "song" : "songs"} saved
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {favorites.length > 0 && (
              <>
                <button
                  onClick={handlePlayAll}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-rose-600
                    to-red-600
                    px-6
                    py-3
                    font-semibold
                    text-white
                    shadow-[0_0_25px_rgba(239,68,68,0.35)]
                    transition-all
                    duration-300
                    hover:scale-105
                  "
                >
                  <Play size={20} fill="white" className="ml-0.5" />
                  Play All
                </button>

                <button
                  onClick={handleShufflePlay}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  <Shuffle size={18} />
                  Shuffle Play
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter / Search within Liked */}
      {favorites.length > 0 && (
        <div className="mb-6 relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search within liked songs..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 py-3 pl-11 pr-4 text-sm text-white placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
          />
        </div>
      )}

      {/* Content List */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Liked Songs Yet"
          description="Songs you mark with a heart will appear here so you can find them easily."
          actionLabel="Find Music"
          onAction={() => navigate("/search")}
        />
      ) : filteredSongs.length === 0 ? (
        <div className="py-12 text-center text-zinc-500">
          No songs matched "{filterQuery}"
        </div>
      ) : (
        <div>
          {filteredSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={() => playQueue(filteredSongs, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
