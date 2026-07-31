import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { usePlayerStore } from "../../store/playerStore";
import BorderGlow from "../ui/BorderGlow";

function RecentlyPlayed() {
  const recentSongs = usePlayerStore((state) => state.recentSongs);
  const playSong = usePlayerStore((state) => state.playSong);

  if (recentSongs.length === 0) return null;

  // Duplicate items for seamless infinite loop
  const displaySongs =
    recentSongs.length < 6
      ? [...recentSongs, ...recentSongs, ...recentSongs, ...recentSongs]
      : [...recentSongs, ...recentSongs];

  return (
    <div className="relative w-full overflow-hidden py-3">
      {/* Edge Gradient Fades for polished look */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-[#09090B] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-[#09090B] to-transparent" />

      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: Math.max(16, recentSongs.length * 4),
        }}
        whileHover={{ transition: { duration: 0 } }}
      >
        {displaySongs.map((song, index) => (
          <div key={`${song.id}-${index}`} className="w-44 flex-shrink-0">
            <BorderGlow
              borderRadius={16}
              glowColor="270 85 65"
              backgroundColor="#120F17"
              glowRadius={25}
              className="group cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <div onClick={() => playSong(song)} className="flex flex-col p-2.5">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-800 mb-2">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[1px]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play size={16} fill="white" className="ml-0.5" />
                    </div>
                  </div>
                </div>

                <h4 className="truncate font-bold text-xs text-white group-hover:text-violet-300">
                  {song.title}
                </h4>
                <p className="truncate text-[11px] text-zinc-400 mt-0.5">
                  {song.artist}
                </p>
              </div>
            </BorderGlow>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default RecentlyPlayed;