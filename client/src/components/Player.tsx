import { usePlayer } from "../context/PlayerContext";

function formatTime(time: number) {
  if (!time || isNaN(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Player() {
  const {
    currentSong,
    isPlaying,
    pauseSong,
    resumeSong,
    currentTime,
    duration,
    seekTo,
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
          marginBottom: "8px",
          fontSize: "14px",
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seekTo(Number(e.target.value))}
        style={{
          width: "100%",
          marginBottom: "15px",
        }}
      />

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