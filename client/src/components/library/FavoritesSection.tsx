import { Heart } from "lucide-react";

function FavoritesSection() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/20 p-3">
          <Heart className="text-violet-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Favorites
          </h2>

          <p className="text-sm text-zinc-400">
            Songs you've liked.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-zinc-500">
        No favorite songs yet.
      </div>
    </div>
  );
}

export default FavoritesSection;