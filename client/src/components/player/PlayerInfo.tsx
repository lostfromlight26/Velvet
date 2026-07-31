import { memo } from "react";

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
    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
      <img
        src={thumbnail}
        alt={title}
        className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl object-cover border border-zinc-700 shadow-md flex-shrink-0"
      />

      <div className="overflow-hidden min-w-0 flex-1">
        <h3 className="truncate text-xs sm:text-base font-semibold text-white">
          {title}
        </h3>

        <p className="truncate text-[11px] sm:text-xs text-zinc-400">
          {artist}
        </p>
      </div>
    </div>
  );
}

export default memo(PlayerInfo);