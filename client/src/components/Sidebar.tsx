import { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Library,
  Plus,
  Search,
  ArrowUpDown,
  PanelLeftClose,
  PanelLeftOpen,
  Heart,
  History,
  ListMusic,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ShinyText from "./ui/ShinyText";
import SpotlightCard from "./ui/SpotlightCard";
import { usePlaylistStore } from "../store/playlistStore";
import { useFavoriteStore } from "../store/favoriteStore";
import { usePlayerStore } from "../store/playerStore";
import { useToastStore } from "../store/toastStore";

type SortOption = "recents" | "alphabetical" | "tracks";

function Sidebar() {
  const navigate = useNavigate();
  const [width, setWidth] = useState<number>(280);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>("recents");
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");

  const { playlists, loadPlaylists, createPlaylist } = usePlaylistStore();
  const favorites = useFavoriteStore((state) => state.favorites);
  const recentSongs = usePlayerStore((state) => state.recentSongs);
  const { showToast } = useToastStore();

  const minWidth = 80;
  const defaultWidth = 280;
  const maxWidth = 420;

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  // Handle Drag Resizing
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const clientX = e.clientX;

      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;
        let newWidth = clientX;
        if (newWidth <= 120) {
          setIsCollapsed(true);
          setWidth(minWidth);
        } else {
          setIsCollapsed(false);
          if (newWidth > maxWidth) newWidth = maxWidth;
          if (newWidth < 220) newWidth = 220;
          setWidth(newWidth);
        }
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = "";
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    if (isResizing) {
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isResizing]);

  const toggleCollapse = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setWidth(defaultWidth);
    } else {
      setIsCollapsed(true);
      setWidth(minWidth);
    }
  };

  const handleCreatePlaylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      await createPlaylist(newPlaylistName.trim());
      showToast(`Created playlist "${newPlaylistName.trim()}"`, "success");
      setNewPlaylistName("");
      setShowCreateModal(false);
    } catch (err) {
      showToast("Failed to create playlist", "error");
    }
  };

  // Filter & Sort Playlists
  const filteredPlaylists = useMemo(() => {
    let result = [...playlists];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "tracks") {
      result.sort((a, b) => (b.songs?.length || 0) - (a.songs?.length || 0));
    } else {
      // Recents - sort by id descending as default proxy
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [playlists, searchQuery, sortBy]);

  const sidebarWidth = isCollapsed ? minWidth : width;

  return (
    <motion.aside
      ref={sidebarRef}
      animate={{ width: sidebarWidth }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="
        relative
        hidden
        md:flex
        h-full
        flex-col
        border-r
        border-white/10
        bg-black/60
        backdrop-blur-3xl
        select-none
        z-30
      "
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          {!isCollapsed && (
            <h1 className="text-3xl font-extrabold tracking-tight cursor-pointer" onClick={() => navigate("/")}>
              <ShinyText text="Velvet" speed={3.5} />
            </h1>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          className="rounded-xl p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition"
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Top Action Toolbar */}
      <div className="px-4 py-2 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <Library size={20} className="text-violet-400" />
            {!isCollapsed && <span className="font-semibold text-sm text-zinc-200">Your Library</span>}
          </div>

          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  title="Search Playlists"
                  className={`rounded-lg p-1.5 transition ${
                    showSearch ? "bg-violet-500/20 text-violet-300" : "text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Search size={18} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    title="Sort Playlists"
                    className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white transition"
                  >
                    <ArrowUpDown size={18} />
                  </button>

                  {showSortMenu && (
                    <div className="absolute right-0 top-9 z-50 w-44 rounded-2xl border border-white/10 bg-zinc-900/95 p-2 shadow-2xl backdrop-blur-xl">
                      <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sort by</p>
                      <button
                        onClick={() => {
                          setSortBy("recents");
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs ${
                          sortBy === "recents" ? "bg-violet-500/20 text-violet-300 font-semibold" : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        Recents
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("alphabetical");
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs ${
                          sortBy === "alphabetical" ? "bg-violet-500/20 text-violet-300 font-semibold" : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        Alphabetical
                      </button>
                      <button
                        onClick={() => {
                          setSortBy("tracks");
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs ${
                          sortBy === "tracks" ? "bg-violet-500/20 text-violet-300 font-semibold" : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        Song Count
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              title="Create Playlist"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-violet-500/20 hover:text-violet-300 transition"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Inline Playlist Search Input */}
        <AnimatePresence>
          {!isCollapsed && showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search playlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-8 pr-8 text-xs text-white placeholder-zinc-500 focus:border-violet-500/50 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 text-zinc-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Independent Scrollable Library Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {/* Liked Songs Shortcut Card */}
        <NavLink
          to="/liked"
          className={({ isActive }) =>
            `block transition-all ${isActive ? "opacity-100 ring-1 ring-violet-500/50 rounded-2xl" : "opacity-90 hover:opacity-100"}`
          }
        >
          <SpotlightCard className="p-2.5 hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-violet-600 shadow-md">
                <Heart size={20} className="text-white" fill="white" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-white">Liked Songs</h4>
                  <p className="text-xs text-zinc-400">{favorites.length} songs</p>
                </div>
              )}
            </div>
          </SpotlightCard>
        </NavLink>

        {/* Recently Played Shortcut Card */}
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `block transition-all ${isActive ? "opacity-100 ring-1 ring-violet-500/50 rounded-2xl" : "opacity-90 hover:opacity-100"}`
          }
        >
          <SpotlightCard className="p-2.5 hover:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-md">
                <History size={20} className="text-white" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-white">Recently Played</h4>
                  <p className="text-xs text-zinc-400">{recentSongs.length} tracks</p>
                </div>
              )}
            </div>
          </SpotlightCard>
        </NavLink>

        <div className="my-2 border-t border-white/5" />

        {/* Playlists Header */}
        {!isCollapsed && (
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <span>Playlists</span>
            <span>{filteredPlaylists.length}</span>
          </div>
        )}

        {/* Playlists List */}
        {filteredPlaylists.length === 0 ? (
          !isCollapsed && (
            <div className="py-6 text-center text-xs text-zinc-500">
              {searchQuery ? "No matching playlists" : "No playlists created yet"}
            </div>
          )
        ) : (
          filteredPlaylists.map((pl) => {
            const songCount = pl.songs?.length || 0;
            const coverThumbnails = pl.songs?.slice(0, 4).map((ps) => ps.thumbnail) || [];

            return (
              <NavLink
                key={pl.id}
                to="/playlists"
                className={({ isActive }) =>
                  `block transition-all ${isActive ? "opacity-100 ring-1 ring-violet-500/50 rounded-2xl" : "opacity-90 hover:opacity-100"}`
                }
              >
                <SpotlightCard className="p-2.5 hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail Cover */}
                    <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-800 border border-white/10 relative">
                      {coverThumbnails.length >= 4 ? (
                        <div className="grid grid-cols-2 h-full w-full">
                          {coverThumbnails.map((thumb: string, idx: number) => (
                            <img key={idx} src={thumb} alt="" className="h-full w-full object-cover" />
                          ))}
                        </div>
                      ) : coverThumbnails.length > 0 ? (
                        <img src={coverThumbnails[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-500">
                          <ListMusic size={18} />
                        </div>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold text-white group-hover:text-violet-300">
                          {pl.name}
                        </h4>
                        <p className="truncate text-xs text-zinc-400">
                          Playlist • {songCount} {songCount === 1 ? "song" : "songs"}
                        </p>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              </NavLink>
            );
          })
        )}
      </div>

      {/* Drag Resizer Handle on Right Edge */}
      <div
        onMouseDown={startResizing}
        className="
          absolute
          right-0
          top-0
          bottom-0
          w-1.5
          cursor-col-resize
          hover:bg-violet-500/50
          transition-colors
          group
          z-40
        "
      >
        <div className="h-full w-full opacity-0 group-hover:opacity-100 bg-violet-500 transition-opacity" />
      </div>

      {/* Create Playlist Quick Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Create Playlist</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreatePlaylistSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Playlist name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
                className="w-full rounded-2xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-500 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-violet-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

export default Sidebar;