import { Play } from "lucide-react";
import { usePlayerStore } from "../../store/playerStore";

function RecentlyPlayed() {
  const recentSongs = usePlayerStore((state) => state.recentSongs);
  const playSong = usePlayerStore((state) => state.playSong);

  if (recentSongs.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
      {recentSongs.map((song) => (
        <button
          key={song.id}
          onClick={() => playSong(song)}
          className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:scale-[1.02] hover:border-violet-500"
        >
          <div className="relative">
            <img
              src={song.thumbnail}
              alt={song.title}
              className="h-44 w-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
              <div className="rounded-full bg-violet-500 p-4">
                <Play
                  fill="white"
                  className="text-white"
                  size={22}
                />
              </div>
            </div>
          </div>

          <div className="p-4 text-left">
            <h3 className="truncate font-semibold">
              {song.title}
            </h3>

            <p className="mt-1 truncate text-sm text-zinc-400">
              {song.artist}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default RecentlyPlayed;