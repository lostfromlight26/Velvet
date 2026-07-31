import { memo } from "react";
import { motion } from "framer-motion";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import type { RepeatMode } from "../../store/playerStore";

interface PlayerControlsProps {
  isPlaying: boolean;
  isShuffle?: boolean;
  repeatMode?: RepeatMode;
  canPlayNext?: boolean;
  canPlayPrevious?: boolean;
  pauseSong: () => void;
  resumeSong: () => void;
  playNext?: () => void;
  playPrevious?: () => void;
  toggleShuffle?: () => void;
  toggleRepeatMode?: () => void;
}

function PlayerControls({
  isPlaying,
  isShuffle = false,
  repeatMode = "off",
  canPlayNext = true,
  canPlayPrevious = true,
  pauseSong,
  resumeSong,
  playNext,
  playPrevious,
  toggleShuffle,
  toggleRepeatMode,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-5">
      {/* Shuffle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleShuffle}
        title={isShuffle ? "Shuffle On" : "Shuffle Off"}
        className={`transition p-1.5 rounded-lg ${
          isShuffle
            ? "text-violet-400 bg-violet-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        <Shuffle size={18} />
      </motion.button>

      {/* Previous Button */}
      <motion.button
        whileHover={canPlayPrevious ? { scale: 1.1 } : {}}
        whileTap={canPlayPrevious ? { scale: 0.95 } : {}}
        onClick={playPrevious}
        disabled={!canPlayPrevious}
        className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition"
        title="Previous Track"
      >
        <SkipBack size={22} />
      </motion.button>

      {/* Play/Pause Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() =>
          isPlaying ? pauseSong() : resumeSong()
        }
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-violet-500
          text-white
          shadow-[0_0_35px_rgba(168,85,247,.45)]
          transition
          hover:bg-gradient-to-br from-violet-500 to-purple-600
        "
      >
        {isPlaying ? (
          <Pause fill="white" size={24} />
        ) : (
          <Play fill="white" size={24} className="ml-1" />
        )}
      </motion.button>

      {/* Next Button */}
      <motion.button
        whileHover={canPlayNext ? { scale: 1.1 } : {}}
        whileTap={canPlayNext ? { scale: 0.95 } : {}}
        onClick={playNext}
        disabled={!canPlayNext}
        className="text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition"
        title="Next Track"
      >
        <SkipForward size={22} />
      </motion.button>

      {/* Repeat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleRepeatMode}
        title={`Repeat: ${repeatMode.toUpperCase()}`}
        className={`transition p-1.5 rounded-lg ${
          repeatMode !== "off"
            ? "text-violet-400 bg-violet-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        {repeatMode === "one" ? <Repeat1 size={18} /> : <Repeat size={18} />}
      </motion.button>
    </div>
  );
}

export default memo(PlayerControls);