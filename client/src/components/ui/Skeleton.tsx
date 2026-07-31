export function SongSkeleton() {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3 animate-pulse">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="h-16 w-16 rounded-xl bg-zinc-800 flex-shrink-0" />
        <div className="space-y-2 flex-1 max-w-sm">
          <div className="h-4 w-3/4 rounded bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-zinc-800/60" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 w-12 rounded bg-zinc-800" />
        <div className="h-11 w-11 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-5 animate-pulse">
      <div className="aspect-square w-full rounded-2xl bg-zinc-800 mb-4" />
      <div className="h-4 w-3/4 rounded bg-zinc-800 mb-2" />
      <div className="h-3 w-1/3 rounded bg-zinc-800/60" />
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 animate-pulse">
      <div className="h-44 w-44 rounded-2xl bg-zinc-800 flex-shrink-0" />
      <div className="flex-1 space-y-4 w-full">
        <div className="h-3 w-20 rounded bg-zinc-800" />
        <div className="h-10 w-2/3 rounded bg-zinc-800" />
        <div className="h-4 w-24 rounded bg-zinc-800/60" />
        <div className="h-12 w-36 rounded-2xl bg-zinc-800" />
      </div>
    </div>
  );
}
