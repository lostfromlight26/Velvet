import { useState, useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { Heart, Play, Plus, Trash2, Check, ListPlus, CornerDownRight, Share2 } from "lucide-react";

import type { Song } from "../types/song";

import { usePlayerStore } from "../store/playerStore";
import { useFavoriteStore } from "../store/favoriteStore";
import { usePlaylistStore } from "../store/playlistStore";
import { useToastStore } from "../store/toastStore";

interface SongCardProps {
  song: Song;
  onRemove?: (songId: string) => void;
  onPlay?: () => void;
}

function SongCard({ song, onRemove, onPlay }: SongCardProps) {
  const playSong = usePlayerStore((state) => state.playSong);
  const currentSongId = usePlayerStore((state) => state.currentSong?.id);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const addToQueue = usePlayerStore((state) => state.addToQueue);
  const playNextInQueue = usePlayerStore((state) => state.playNextInQueue);

  const toggleFavorite = useFavoriteStore(
    (state) => state.toggleFavorite
  );

  const isFavorite = useFavoriteStore((state) =>
    state.isFavorite(song.id)
  );

  const { showToast } = useToastStore();
  const { playlists, addSongToPlaylist, loadPlaylists } = usePlaylistStore();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const currentlyPlaying = currentSongId === song.id && isPlaying;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
    };
    if (showOptionsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptionsMenu]);

  const handleOpenMenu = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showOptionsMenu) {
      await loadPlaylists();
    }
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleAddToQueue = () => {
    addToQueue(song);
    showToast(`Added "${song.title}" to queue`, "success");
    setAddedMessage("Added to queue");
    setTimeout(() => {
      setAddedMessage(null);
      setShowOptionsMenu(false);
    }, 800);
  };

  const handlePlayNextInQueue = () => {
    playNextInQueue(song);
    showToast(`Will play "${song.title}" next`, "success");
    setAddedMessage("Playing next");
    setTimeout(() => {
      setAddedMessage(null);
      setShowOptionsMenu(false);
    }, 800);
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      await addSongToPlaylist(playlistId, song);
      const targetPl = playlists.find((p) => p.id === playlistId);
      showToast(`Added to "${targetPl?.name || "playlist"}"`, "success");
      setAddedMessage("Added to playlist");
      setTimeout(() => {
        setAddedMessage(null);
        setShowOptionsMenu(false);
      }, 800);
    } catch (err) {
      showToast("Failed to add song to playlist", "error");
    }
  };

  const handleToggleFavorite = async () => {
    const wasFavorite = isFavorite;
    await toggleFavorite(song);
    showToast(
      wasFavorite
        ? `Removed "${song.title}" from favorites`
        : `Added "${song.title}" to favorites`,
      wasFavorite ? "info" : "success"
    );
  };

  const handleShare = async () => {
    try {
      const shareData = `${song.title} - ${song.artist} (https://youtube.com/watch?v=${song.id})`;
      await navigator.clipboard.writeText(shareData);
      showToast("Song details copied to clipboard!", "success");
      setShowOptionsMenu(false);
    } catch (err) {
      showToast("Failed to copy share link", "error");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
      className={`
        group
        relative
        ${showOptionsMenu ? "z-50" : "z-0"}
        mb-3
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/90
        px-3
        py-2.5
        sm:px-4
        sm:py-3
        transition-all
        duration-300
        hover:border-violet-500/60
        hover:bg-zinc-800/90
      `}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 mr-2">
        <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-800">
          <img
            src={song.thumbnail}
            alt={song.title}
            className="h-full w-full object-cover"
          />
          {currentlyPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <div className="flex items-end gap-1 h-5">
                <span className="w-1 bg-violet-400 animate-[bounce_0.8s_infinite_100ms] rounded-full h-full" />
                <span className="w-1 bg-violet-400 animate-[bounce_0.8s_infinite_300ms] rounded-full h-2/3" />
                <span className="w-1 bg-violet-400 animate-[bounce_0.8s_infinite_200ms] rounded-full h-5/6" />
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-white text-xs sm:text-base">
            {song.title}
          </h3>

          <p className="mt-0.5 sm:mt-1 truncate text-[11px] sm:text-sm text-zinc-400">
            {song.artist}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div ref={menuRef} className="relative">
          <button
            onClick={handleOpenMenu}
            title="Options & Playlists"
            className="rounded-lg p-1.5 sm:p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
          </button>

          {showOptionsMenu && (
            <div className="absolute right-0 top-10 z-50 w-56 sm:w-60 rounded-2xl border border-white/10 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-xl">
              {addedMessage ? (
                <div className="flex items-center gap-2 p-3 text-sm font-medium text-violet-300">
                  <Check size={16} />
                  {addedMessage}
                </div>
              ) : (
                <>
                  <div className="border-b border-white/10 pb-2 mb-2">
                    <button
                      onClick={handlePlayNextInQueue}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs sm:text-sm text-zinc-200 hover:bg-violet-500/20 hover:text-white"
                    >
                      <CornerDownRight size={16} className="text-violet-400" />
                      Play Next
                    </button>
                    <button
                      onClick={handleAddToQueue}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs sm:text-sm text-zinc-200 hover:bg-violet-500/20 hover:text-white"
                    >
                      <ListPlus size={16} className="text-violet-400" />
                      Add to Queue
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs sm:text-sm text-zinc-200 hover:bg-violet-500/20 hover:text-white"
                    >
                      <Share2 size={16} className="text-violet-400" />
                      Share Track
                    </button>
                  </div>

                  <p className="px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase text-zinc-400">
                    Add to Playlist
                  </p>
                  <div className="max-h-40 overflow-y-auto">
                    {playlists.length === 0 ? (
                      <p className="px-3 py-2 text-xs text-zinc-500">
                        No playlists found.
                      </p>
                    ) : (
                      playlists.map((pl) => (
                        <button
                          key={pl.id}
                          onClick={() => handleAddToPlaylist(pl.id)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm text-zinc-200 hover:bg-violet-500/20 hover:text-white"
                        >
                          <span className="truncate">{pl.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {onRemove && (
          <button
            onClick={() => onRemove(song.id)}
            title="Remove from Playlist"
            className="rounded-lg p-1.5 sm:p-2 text-zinc-400 transition hover:bg-red-500/20 hover:text-red-400"
          >
            <Trash2 size={18} className="sm:w-5 sm:h-5" />
          </button>
        )}

        <button
          onClick={handleToggleFavorite}
          className="text-zinc-400 transition hover:text-red-500 p-1"
        >
          <Heart
            size={18}
            className="sm:w-[22px] sm:h-[22px]"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        <span className="hidden sm:inline text-xs sm:text-sm text-zinc-400">
          {song.duration}
        </span>

        <button
          onClick={() => (onPlay ? onPlay() : playSong(song))}
          className={`flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all ${
            currentlyPlaying
              ? "bg-violet-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              : "bg-zinc-800 group-hover:bg-violet-500"
          }`}
        >
          <Play
            size={16}
            fill="white"
            className="ml-0.5 text-white sm:w-[18px] sm:h-[18px]"
          />
        </button>
      </div>
    </motion.div>
  );
}

export default memo(SongCard);