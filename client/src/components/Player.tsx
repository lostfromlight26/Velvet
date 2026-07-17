import { usePlayerStore } from "../store/playerStore";

import PlayerInfo from "./player/PlayerInfo";
import PlayerControls from "./player/PlayerControls";
import PlayerProgress from "./player/PlayerProgress";
import VolumeControl from "./player/VolumeControl";

function formatTime(time: number) {
  if (!time || isNaN(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Player() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    pauseSong,
    resumeSong,
    seekTo,
    setVolume,
  } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[96%] max-w-7xl -translate-x-1/2">
      <div
        className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-2xl
          shadow-[0_0_40px_rgba(168,85,247,0.18)]
          px-8
          py-5
        "
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <PlayerInfo
            thumbnail={currentSong.thumbnail}
            title={currentSong.title}
            artist={currentSong.artist}
          />

          {/* Center */}
          <div className="flex flex-1 flex-col items-center gap-4 px-4">
            <PlayerControls
              isPlaying={isPlaying}
              pauseSong={pauseSong}
              resumeSong={resumeSong}
            />

            <div className="w-full max-w-xl">
              <PlayerProgress
                currentTime={currentTime}
                duration={duration}
                seekTo={seekTo}
                formatTime={formatTime}
              />
            </div>
          </div>

          {/* Right */}
          <VolumeControl
            volume={volume}
            setVolume={setVolume}
          />
        </div>
      </div>
    </div>
  );
}

export default Player;