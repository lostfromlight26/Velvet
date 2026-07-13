import type { Song } from "../types/song";
import SongCard from "./SongCard";

interface SongListProps {
  songs: Song[];
}

function SongList({ songs }: SongListProps) {
  if (songs.length === 0) {
    return <p>No songs found.</p>;
  }

  return (
    <div style={{ marginTop: "30px" }}>
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