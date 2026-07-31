import { useEffect, useState } from "react";
import { LibraryBig, Plus, Music, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlaylistStore } from "../../store/playlistStore";
import { usePlayerStore } from "../../store/playerStore";

function PlaylistSection() {
  const navigate = useNavigate();
  const { playlists, loadPlaylists, createPlaylist } = usePlaylistStore();
  const playQueue = usePlayerStore((state) => state.playQueue);

  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  const handleCreate = async (e: React.FormEvent) => {
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

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-6
        shadow-[0_0_25px_rgba(168,85,247,0.08)]
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/20 p-3">
            <LibraryBig
              size={24}
              className="text-violet-400"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Playlists
            </h2>

            <p className="text-sm text-zinc-400">
              Organize your music.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-violet-600
            to-purple-600
            px-4
            py-2
            text-white
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-[0_0_20px_rgba(168,85,247,.35)]
          "
        >
          <Plus size={18} />
          Create
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Playlist name..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-4 py-2 font-medium text-white transition hover:bg-violet-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreating(false);
              setNewPlaylistName("");
            }}
            className="rounded-xl border border-white/10 px-4 py-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-dashed
            border-zinc-700
            p-8
            text-center
            text-zinc-500
          "
        >
          No playlists created yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  rounded-2xl
                  border
                  border-white/5
                  bg-zinc-900/60
                  p-4
                  transition-all
                  duration-300
                  hover:border-violet-500/50
                  hover:bg-zinc-800/80
                  hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]
                "
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-800 mb-3 flex items-center justify-center">
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
                      <Music size={36} className="text-violet-400/60" />
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
                        bottom-3
                        right-3
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-violet-500
                        text-white
                        opacity-0
                        shadow-lg
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        hover:scale-110
                      "
                    >
                      <Play size={18} fill="white" className="ml-0.5" />
                    </button>
                  )}
                </div>

                <h3 className="truncate text-base font-semibold text-white group-hover:text-violet-300">
                  {playlist.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
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

export default PlaylistSection;