import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/40 p-12 text-center my-6">
      <div className="rounded-2xl bg-violet-500/10 p-4 text-violet-400 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <Icon size={36} />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="max-w-md text-sm text-zinc-400 mb-6">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-purple-600
            px-6
            py-3
            font-semibold
            text-white
            shadow-[0_0_20px_rgba(168,85,247,0.3)]
            transition-all
            duration-300
            hover:scale-105
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
