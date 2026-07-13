import { usePlayer } from "../context/PlayerContext";

function Player() {
  const {
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "20px",
        background: "#222",
        color: "white",
        borderTop: "1px solid #444",
      }}
    >
      <h3>🎵 Now Playing</h3>

      <p>
        <strong>{currentSong.title}</strong>
      </p>

      <p>{currentSong.artist}</p>

      <button
        onClick={() => {
          if (isPlaying) {
            pauseSong();
          } else {
            resumeSong();
          }
        }}
      >
        {isPlaying ? "⏸ Pause" : "▶ Resume"}
      </button>
    </div>
  );
}

export default Player;