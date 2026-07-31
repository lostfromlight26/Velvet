import { memo } from "react";
import { VolumeX, Volume2 } from "lucide-react";
import ElasticSlider from "../ui/ElasticSlider";

interface VolumeControlProps {
  volume: number;
  setVolume: (volume: number) => void;
}

function VolumeControl({ volume, setVolume }: VolumeControlProps) {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <ElasticSlider
        defaultValue={Math.round(volume * 100)}
        startingValue={0}
        maxValue={100}
        leftIcon={
          <VolumeX
            size={16}
            className="text-zinc-400 hover:text-white transition cursor-pointer"
            onClick={() => setVolume(0)}
          />
        }
        rightIcon={
          <Volume2
            size={16}
            className="text-violet-400 hover:text-violet-300 transition cursor-pointer"
            onClick={() => setVolume(1)}
          />
        }
        onChange={(val) => setVolume(val / 100)}
      />
    </div>
  );
}

export default memo(VolumeControl);