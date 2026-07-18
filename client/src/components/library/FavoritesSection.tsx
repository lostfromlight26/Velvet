import { Heart } from "lucide-react";

import SongCard from "../SongCard";

import { useFavoriteStore } from "../../store/favoriteStore";

function FavoritesSection() {
  const favorites = useFavoriteStore((state) => state.favorites);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/20 p-3">
          <Heart
            className="text-violet-400"
            fill="currentColor"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Favorites
          </h2>

          <p className="text-sm text-zinc-400">
            {favorites.length} liked song{favorites.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-zinc-500">
            You haven't liked any songs yet.
          </div>
        ) : (
          favorites.map((song) => (
            <SongCard
              key={song.id}
              song={song}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FavoritesSection;