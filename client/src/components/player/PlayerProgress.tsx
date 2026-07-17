interface PlayerProgressProps {
  currentTime: number;
  duration: number;
  seekTo: (time: number) => void;
  formatTime: (time: number) => string;
}

function PlayerProgress({
  currentTime,
  duration,
  seekTo,
  formatTime,
}: PlayerProgressProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="text-xs text-zinc-400 w-10">
        {formatTime(currentTime)}
      </span>

      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) =>
          seekTo(Number(e.target.value))
        }
        className="h-1 w-full accent-violet-500"
      />

      <span className="text-xs text-zinc-400 w-10 text-right">
        {formatTime(duration)}
      </span>
    </div>
  );
}

export default PlayerProgress;