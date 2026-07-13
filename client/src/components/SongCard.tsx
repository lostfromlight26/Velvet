import type { Song } from "../types/song";
import { usePlayerStore } from "../store/playerStore";

interface SongCardProps {
  song: Song;
}

function SongCard({ song }: SongCardProps) {
  const playSong = usePlayerStore((state) => state.playSong);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  const currentlyPlaying =
    currentSong?.id === song.id && isPlaying;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "15px",
      }}
    >
      <img
        src={song.thumbnail}
        width={120}
        alt={song.title}
      />

      <h3>{song.title}</h3>

      <p>{song.artist}</p>

      <p>{song.duration}</p>

      <button onClick={() => playSong(song)}>
        {currentlyPlaying ? "🎵 Playing" : "▶ Play"}
      </button>
    </div>
  );
}

export default SongCard;