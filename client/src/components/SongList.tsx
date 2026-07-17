import type { Song } from "../types/song";
import SongCard from "./SongCard";

interface SongListProps {
  songs: Song[];
}

function SongList({ songs }: SongListProps) {
  if (songs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 py-16 text-center text-zinc-500">
        Search for a song to see recommendations.
      </div>
    );
  }

  return (
    <div className="mt-6">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
        />
      ))}
    </div>
  );
}

export default SongList;