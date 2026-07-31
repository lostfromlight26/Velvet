import { useCallback } from "react";
import { ListMusic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "../store/playerStore";

import PlayerInfo from "./player/PlayerInfo";
import PlayerControls from "./player/PlayerControls";
import PlayerProgress from "./player/PlayerProgress";
import VolumeControl from "./player/VolumeControl";
import MiniQueuePanel from "./player/MiniQueuePanel";

function formatTime(time: number) {
  if (!time || isNaN(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Player() {
  const currentSong = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const duration = usePlayerStore((s) => s.duration);
  const volume = usePlayerStore((s) => s.volume);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const isQueueOpen = usePlayerStore((s) => s.isQueueOpen);

  const pauseSong = usePlayerStore((s) => s.pauseSong);
  const resumeSong = usePlayerStore((s) => s.resumeSong);
  const seekTo = usePlayerStore((s) => s.seekTo);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const playNext = usePlayerStore((s) => s.playNext);
  const playPrevious = usePlayerStore((s) => s.playPrevious);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeatMode = usePlayerStore((s) => s.toggleRepeatMode);
  const toggleQueuePanel = usePlayerStore((s) => s.toggleQueuePanel);

  const handleSeek = useCallback((time: number) => {
    seekTo(time);
  }, [seekTo]);

  if (!currentSong) return null;

  const canPlayPrevious = queueLength > 0 && (currentIndex > 0 || currentTime > 3 || repeatMode === "queue");
  const canPlayNext = queueLength > 0 && (currentIndex < queueLength - 1 || repeatMode !== "off" || isShuffle);

  return (
    <>
      <MiniQueuePanel />

      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-16 md:bottom-5 left-1/2 md:left-[calc(50%+120px)] z-[60] w-[95%] md:w-[calc(90%-140px)] max-w-6xl -translate-x-1/2"
        >
          <div
            className="
              rounded-2xl
              sm:rounded-3xl
              border
              border-white/10
              bg-zinc-900/95
              md:bg-white/5
              backdrop-blur-2xl
              shadow-[0_0_40px_rgba(168,85,247,0.18)]
              px-3
              py-2.5
              sm:px-6
              sm:py-4
            "
          >
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              {/* Top Row / Left: Song Info & Mobile Quick Controls */}
              <div className="flex items-center justify-between min-w-0 flex-1 gap-2">
                <PlayerInfo
                  thumbnail={currentSong.thumbnail}
                  title={currentSong.title}
                  artist={currentSong.artist}
                />

                <div className="flex items-center gap-1.5 lg:hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleQueuePanel}
                    title="Playback Queue"
                    className={`relative rounded-xl p-1.5 transition ${
                      isQueueOpen
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <ListMusic size={18} />
                    {queueLength > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-500 text-[9px] font-bold text-white">
                        {queueLength}
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Center Controls & Progress */}
              <div className="flex flex-1 flex-col items-center gap-1.5 sm:gap-3 px-1 sm:px-4">
                <PlayerControls
                  isPlaying={isPlaying}
                  isShuffle={isShuffle}
                  repeatMode={repeatMode}
                  canPlayNext={canPlayNext}
                  canPlayPrevious={canPlayPrevious}
                  pauseSong={pauseSong}
                  resumeSong={resumeSong}
                  playNext={playNext}
                  playPrevious={playPrevious}
                  toggleShuffle={toggleShuffle}
                  toggleRepeatMode={toggleRepeatMode}
                />

                <div className="w-full max-w-xl">
                  <PlayerProgress
                    currentTime={currentTime}
                    duration={duration}
                    seekTo={handleSeek}
                    formatTime={formatTime}
                  />
                </div>
              </div>

              {/* Right (Desktop Queue & Volume) */}
              <div className="hidden lg:flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleQueuePanel}
                  title="Playback Queue"
                  className={`relative rounded-xl p-2.5 transition ${
                    isQueueOpen
                      ? "bg-violet-500/20 text-violet-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <ListMusic size={22} />
                  {queueLength > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                      {queueLength}
                    </span>
                  )}
                </motion.button>

                <VolumeControl
                  volume={volume}
                  setVolume={setVolume}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default Player;