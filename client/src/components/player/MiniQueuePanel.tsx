import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListMusic, Trash2, ArrowUp, ArrowDown, Play, X } from "lucide-react";
import { usePlayerStore } from "../../store/playerStore";
import EmptyState from "../ui/EmptyState";

function MiniQueuePanel() {
  const queue = usePlayerStore((state) => state.queue);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const isQueueOpen = usePlayerStore((state) => state.isQueueOpen);
  const toggleQueuePanel = usePlayerStore((state) => state.toggleQueuePanel);
  const jumpToQueueIndex = usePlayerStore((state) => state.jumpToQueueIndex);
  const removeFromQueue = usePlayerStore((state) => state.removeFromQueue);
  const moveQueueItem = usePlayerStore((state) => state.moveQueueItem);
  const clearQueue = usePlayerStore((state) => state.clearQueue);

  return (
    <AnimatePresence>
      {isQueueOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="
            fixed
            bottom-28
            right-6
            z-50
            w-96
            max-w-[calc(100vw-3rem)]
            rounded-3xl
            border
            border-white/10
            bg-zinc-900/95
            p-5
            shadow-[0_0_50px_rgba(0,0,0,0.8)]
            backdrop-blur-2xl
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <ListMusic size={20} className="text-violet-400" />
              <h2 className="font-bold text-white">Playback Queue</h2>
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-semibold text-violet-300">
                {queue.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {queue.length > 0 && (
                <button
                  onClick={clearQueue}
                  className="text-xs font-medium text-zinc-400 hover:text-red-400 transition"
                  title="Clear Queue"
                >
                  Clear
                </button>
              )}

              <button
                onClick={toggleQueuePanel}
                className="rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* Now Playing Section */}
            {currentSong ? (
              <div className="mb-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-400">
                  Now Playing
                </p>

                <div className="flex items-center gap-3 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-3">
                  <img
                    src={currentSong.thumbnail}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-white">
                      {currentSong.title}
                    </h3>
                    <p className="truncate text-xs text-zinc-400">
                      {currentSong.artist}
                    </p>
                  </div>

                  {/* Animated Equalizer Wave Icon */}
                  {isPlaying && (
                    <div className="flex items-end gap-0.5 h-4 px-1">
                      <span className="w-1 bg-violet-400 animate-[bounce_1s_infinite_100ms] rounded-full h-full" />
                      <span className="w-1 bg-violet-400 animate-[bounce_1s_infinite_300ms] rounded-full h-2/3" />
                      <span className="w-1 bg-violet-400 animate-[bounce_1s_infinite_200ms] rounded-full h-5/6" />
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Queue List */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Next Up
              </p>

              {queue.length === 0 ? (
                <EmptyState
                  icon={ListMusic}
                  title="Queue is Empty"
                  description="Add songs from Search or Library to keep the music playing."
                />
              ) : (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {queue.map((song, index) => {
                      const isCurrent = index === currentIndex;

                      return (
                        <motion.div
                          key={`${song.id}-${index}`}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className={`
                            group
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            p-2.5
                            transition
                            ${
                              isCurrent
                                ? "border border-violet-500/40 bg-violet-500/15"
                                : "bg-white/5 hover:bg-white/10"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="w-4 text-center text-xs font-semibold text-zinc-500">
                              {index + 1}
                            </span>
                            <img
                              src={song.thumbnail}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-xs font-semibold text-white">
                                {song.title}
                              </h4>
                              <p className="truncate text-[11px] text-zinc-400">
                                {song.artist}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => jumpToQueueIndex(index)}
                              title="Play Now"
                              className="rounded p-1 text-zinc-400 hover:bg-violet-500 hover:text-white transition"
                            >
                              <Play size={14} fill="currentColor" />
                            </button>

                            <button
                              onClick={() => moveQueueItem(index, index - 1)}
                              disabled={index === 0}
                              title="Move Up"
                              className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30 transition"
                            >
                              <ArrowUp size={14} />
                            </button>

                            <button
                              onClick={() => moveQueueItem(index, index + 1)}
                              disabled={index === queue.length - 1}
                              title="Move Down"
                              className="rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white disabled:opacity-30 transition"
                            >
                              <ArrowDown size={14} />
                            </button>

                            <button
                              onClick={() => removeFromQueue(index)}
                              title="Remove"
                              className="rounded p-1 text-zinc-400 hover:bg-red-500/20 hover:text-red-400 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(MiniQueuePanel);
