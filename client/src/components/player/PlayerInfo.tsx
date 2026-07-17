interface PlayerInfoProps {
  thumbnail: string;
  title: string;
  artist: string;
}

function PlayerInfo({
  thumbnail,
  title,
  artist,
}: PlayerInfoProps) {
  return (
    <div className="flex items-center gap-4 min-w-[280px]">
      <img
        src={thumbnail}
        alt={title}
        className="h-16 w-16 rounded-2xl object-cover border border-zinc-700 shadow-[0_0_18px_rgba(232,220,198,0.22)]"
      />

      <div className="overflow-hidden">
        <h3 className="truncate text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="truncate text-sm text-zinc-400">
          {artist}
        </p>
      </div>
    </div>
  );
}

export default PlayerInfo;