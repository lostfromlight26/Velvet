import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface PlayerControlsProps {
  isPlaying: boolean;
  pauseSong: () => void;
  resumeSong: () => void;
}

function PlayerControls({
  isPlaying,
  pauseSong,
  resumeSong,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-5">
      <button className="text-zinc-400 hover:text-white transition">
        <SkipBack size={22} />
      </button>

      <button
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
          shadow-[shadow-[0_0_35px_rgba(168,85,247,.45)]]
          transition
          hover:scale-105
          hover:bg-gradient-to-br from-violet-500 to-purple-600
        "
      >
        {isPlaying ? (
          <Pause fill="white" size={24} />
        ) : (
          <Play fill="white" size={24} className="ml-1" />
        )}
      </button>

      <button className="text-zinc-400 hover:text-white transition">
        <SkipForward size={22} />
      </button>
    </div>
  );
}

export default PlayerControls;