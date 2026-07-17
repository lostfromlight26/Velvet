import { LibraryBig, Plus } from "lucide-react";

function PlaylistSection() {
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
    </div>
  );
}

export default PlaylistSection;