import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Play,
  Plus,
  Edit2,
  Trash2,
  ArrowLeft,
  Music,
  Check,
  X,
} from "lucide-react";

import { usePlaylistStore } from "../store/playlistStore";
import { usePlayerStore } from "../store/playerStore";
import SongCard from "../components/SongCard";
import type { Song } from "../types/song";

function PlaylistPage() {
  const [searchParams] = useSearchParams();
  const playlistIdParam = searchParams.get("id");
  const navigate = useNavigate();

  const {
    playlists,
    activePlaylist,
    loading,
    loadPlaylists,
    loadPlaylistDetails,
    createPlaylist,
    renamePlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
  } = usePlaylistStore();

  const playQueue = usePlayerStore((state) => state.playQueue);

  // States
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  useEffect(() => {
    if (playlistIdParam) {
      loadPlaylistDetails(playlistIdParam);
    }
  }, [playlistIdParam, loadPlaylistDetails]);

  const handleStartRename = () => {
    if (activePlaylist) {
      setEditedTitle(activePlaylist.name);
      setIsEditingTitle(true);
    }
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlaylist || !editedTitle.trim()) return;
    try {
      await renamePlaylist(activePlaylist.id, editedTitle.trim());
      setIsEditingTitle(false);
    } catch (err) {
      alert("Failed to rename playlist");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!activePlaylist) return;
    if (window.confirm(`Are you sure you want to delete "${activePlaylist.name}"?`)) {
      try {
        await deletePlaylist(activePlaylist.id);
        navigate("/playlists");
      } catch (err) {
        alert("Failed to delete playlist");
      }
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    try {
      const created = await createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsCreating(false);
      if (created) {
        navigate(`/playlists?id=${created.id}`);
      }
    } catch (err) {
      alert("Failed to create playlist");
    }
  };

  const handlePlayAll = () => {
    if (!activePlaylist || !activePlaylist.songs || activePlaylist.songs.length === 0)
      return;
    const formattedSongs: Song[] = activePlaylist.songs.map((s) => ({
      id: s.youtubeId,
      title: s.title,
      artist: s.artist,
      thumbnail: s.thumbnail,
      duration: s.duration,
    }));
    playQueue(formattedSongs, 0);
  };

  const handlePlaySongAtIndex = (index: number) => {
    if (!activePlaylist || !activePlaylist.songs) return;
    const formattedSongs: Song[] = activePlaylist.songs.map((s) => ({
      id: s.youtubeId,
      title: s.title,
      artist: s.artist,
      thumbnail: s.thumbnail,
      duration: s.duration,
    }));
    playQueue(formattedSongs, index);
  };

  const handleRemoveSong = async (songYoutubeId: string) => {
    if (!activePlaylist) return;
    try {
      await removeSongFromPlaylist(activePlaylist.id, songYoutubeId);
    } catch (err) {
      alert("Failed to remove song from playlist");
    }
  };

  // Render Playlist Details View
  if (playlistIdParam && activePlaylist) {
    const songs = activePlaylist.songs || [];
    const songCount = songs.length;
    const thumbnails = songs.map((s) => s.thumbnail).filter(Boolean).slice(0, 4);

    return (
      <div className="min-h-full pb-16 md:pb-24 p-3 sm:p-6">
        <button
          onClick={() => navigate("/playlists")}
          className="mb-4 sm:mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back to Playlists
        </button>

        {/* Playlist Details Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-4 sm:gap-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-4 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.12)]">
          {/* Cover Art / Thumbnails */}
          <div className="h-32 w-32 sm:h-44 sm:w-44 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl flex items-center justify-center">
            {thumbnails.length >= 4 ? (
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                {thumbnails.map((t, idx) => (
                  <img key={idx} src={t} alt="" className="h-full w-full object-cover" />
                ))}
              </div>
            ) : thumbnails.length > 0 ? (
              <img src={thumbnails[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-violet-950/40">
                <Music size={44} className="text-violet-400/60 sm:w-[56px] sm:h-[56px]" />
              </div>
            )}
          </div>

          {/* Info & Actions */}
          <div className="flex-1 min-w-0 w-full">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-violet-400">
              Playlist
            </p>

            {isEditingTitle ? (
              <form onSubmit={handleSaveRename} className="mt-2 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="rounded-xl border border-violet-500 bg-zinc-900 px-3 py-1.5 text-lg sm:text-2xl font-bold text-white focus:outline-none w-full max-w-xs"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 p-2 text-white hover:bg-violet-500"
                >
                  <Check size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(false)}
                  className="rounded-xl border border-white/10 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </form>
            ) : (
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <h1 className="truncate text-2xl sm:text-4xl font-extrabold text-white">
                  {activePlaylist.name}
                </h1>
                <button
                  onClick={handleStartRename}
                  title="Rename Playlist"
                  className="rounded-xl p-1.5 sm:p-2 text-zinc-400 hover:bg-white/10 hover:text-white transition"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            )}

            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              {songCount} {songCount === 1 ? "song" : "songs"}
            </p>

            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
              {songCount > 0 && (
                <button
                  onClick={handlePlayAll}
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-purple-600
                    px-4
                    sm:px-6
                    py-2.5
                    sm:py-3
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-white
                    shadow-[0_0_25px_rgba(168,85,247,0.35)]
                    transition-all
                    duration-300
                    hover:scale-105
                  "
                >
                  <Play size={18} fill="white" className="ml-0.5" />
                  Play All
                </button>
              )}

              <button
                onClick={handleDeletePlaylist}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-red-500/30
                  bg-red-500/10
                  px-4
                  sm:px-5
                  py-2.5
                  sm:py-3
                  text-xs
                  sm:text-sm
                  font-medium
                  text-red-400
                  transition
                  hover:bg-red-500/20
                  hover:text-red-300
                "
              >
                <Trash2 size={16} />
                Delete Playlist
              </button>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-white">Tracks</h2>

          {songs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center text-zinc-500">
              This playlist has no songs yet. Search for tracks and click "+" to add them!
            </div>
          ) : (
            <div>
              {songs.map((songItem, index) => {
                const formattedSong: Song = {
                  id: songItem.youtubeId,
                  title: songItem.title,
                  artist: songItem.artist,
                  thumbnail: songItem.thumbnail,
                  duration: songItem.duration,
                };

                return (
                  <SongCard
                    key={songItem.id || index}
                    song={formattedSong}
                    onRemove={handleRemoveSong}
                    onPlay={() => handlePlaySongAtIndex(index)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render All Playlists View
  return (
    <div className="min-h-full pb-44 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Playlists</h1>
          <p className="mt-2 text-zinc-400">
            Create and manage your personal music collections.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-purple-600
            px-5
            py-3
            font-semibold
            text-white
            shadow-[0_0_25px_rgba(168,85,247,0.3)]
            transition-all
            duration-300
            hover:scale-105
          "
        >
          <Plus size={20} />
          Create Playlist
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreatePlaylist} className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="Playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreating(false);
              setNewPlaylistName("");
            }}
            className="rounded-xl border border-white/10 px-6 py-3 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {loading && playlists.length === 0 ? (
        <div className="p-12 text-center text-zinc-400">Loading playlists...</div>
      ) : playlists.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
          No playlists created yet. Click "+ Create Playlist" above to start!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map((playlist) => {
            const songs = playlist.songs || [];
            const songCount = songs.length;
            const thumbnails = songs.map((s) => s.thumbnail).filter(Boolean).slice(0, 4);

            return (
              <div
                key={playlist.id}
                onClick={() => navigate(`/playlists?id=${playlist.id}`)}
                className="
                  group
                  cursor-pointer
                  rounded-3xl
                  border
                  border-white/10
                  bg-zinc-900/70
                  p-5
                  transition-all
                  duration-300
                  hover:border-violet-500/50
                  hover:bg-zinc-800/80
                  hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]
                "
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-800 mb-4 flex items-center justify-center shadow-lg">
                  {thumbnails.length >= 4 ? (
                    <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                      {thumbnails.map((t, idx) => (
                        <img key={idx} src={t} alt="" className="h-full w-full object-cover" />
                      ))}
                    </div>
                  ) : thumbnails.length > 0 ? (
                    <img src={thumbnails[0]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-violet-950/30">
                      <Music size={44} className="text-violet-400/60" />
                    </div>
                  )}

                  {songCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const mappedSongs = songs.map((s) => ({
                          id: s.youtubeId,
                          title: s.title,
                          artist: s.artist,
                          thumbnail: s.thumbnail,
                          duration: s.duration,
                        }));
                        playQueue(mappedSongs, 0);
                      }}
                      title="Play Playlist"
                      className="
                        absolute
                        bottom-4
                        right-4
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-violet-500
                        text-white
                        opacity-0
                        shadow-xl
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        hover:scale-110
                      "
                    >
                      <Play size={20} fill="white" className="ml-0.5" />
                    </button>
                  )}
                </div>

                <h3 className="truncate text-lg font-bold text-white group-hover:text-violet-300">
                  {playlist.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {songCount} {songCount === 1 ? "song" : "songs"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PlaylistPage;