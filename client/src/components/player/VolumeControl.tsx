import { Volume2 } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  setVolume: (volume: number) => void;
}

function VolumeControl({
  volume,
  setVolume,
}: VolumeControlProps) {
  return (
    <div className="hidden lg:flex items-center gap-3 w-48">
      <Volume2
        size={20}
        className="text-zinc-400"
      />

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) =>
          setVolume(Number(e.target.value))
        }
        className="h-1 w-full accent-violet-500"
      />
    </div>
  );
}

export default VolumeControl;