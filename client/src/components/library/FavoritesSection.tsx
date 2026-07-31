import { Heart, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SongCard from "../SongCard";
import EmptyState from "../ui/EmptyState";
import { useFavoriteStore } from "../../store/favoriteStore";

function FavoritesSection() {
  const navigate = useNavigate();
  const favorites = useFavoriteStore((state) => state.favorites);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-rose-500/20 p-3">
            <Heart
              className="text-rose-400"
              fill="currentColor"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Liked Songs
            </h2>

            <p className="text-sm text-zinc-400">
              {favorites.length} liked song{favorites.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={() => navigate("/liked")}
            className="flex items-center gap-1 text-sm font-semibold text-rose-400 hover:text-rose-300 transition"
          >
            View All <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="mt-6">
        {favorites.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No Liked Songs"
            description="Explore songs and click the heart icon to save them to your library."
            actionLabel="Discover Music"
            onAction={() => navigate("/search")}
          />
        ) : (
          favorites.slice(0, 5).map((song) => (
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