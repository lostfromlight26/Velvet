import { usePlayerStore } from "../store/playerStore";

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
    currentTime,
    duration,
    volume,
    pauseSong,
    resumeSong,
    seekTo,
    setVolume,
  } = usePlayerStore();

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
        }}
      />

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
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

        <span>🔊</span>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{
            width: "150px",
          }}
        />
      </div>
    </div>
  );
}

export default Player;