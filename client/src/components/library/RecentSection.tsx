import { History } from "lucide-react";

function RecentSection() {
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
            Continue listening.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-zinc-700 p-8 text-center text-zinc-500">
        Your recently played songs will appear here.
      </div>
    </div>
  );
}

export default RecentSection;