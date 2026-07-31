import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";

import RecentlyPlayed from "../home/RecentlyPlayed";
import EmptyState from "../ui/EmptyState";
import { usePlayerStore } from "../../store/playerStore";

function RecentSection() {
  const navigate = useNavigate();
  const recentSongs = usePlayerStore((state) => state.recentSongs);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/20 p-3">
          <History className="text-violet-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Recently Played
          </h2>

          <p className="text-sm text-zinc-400">
            Continue listening to your history.
          </p>
        </div>
      </div>

      <div className="mt-6">
        {recentSongs.length === 0 ? (
          <EmptyState
            icon={History}
            title="No Recent Activity"
            description="Songs you listen to will automatically show up here."
            actionLabel="Start Listening"
            onAction={() => navigate("/search")}
          />
        ) : (
          <RecentlyPlayed />
        )}
      </div>
    </div>
  );
}

export default RecentSection;