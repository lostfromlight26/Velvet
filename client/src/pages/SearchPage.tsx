import { useState } from "react";

import SearchBar from "../components/SearchBar";
import SongList from "../components/SongList";

import { searchSongs } from "../services/musicService";
import { usePlayerStore } from "../store/playerStore";

import type { Song } from "../types/song";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const recentSongs = usePlayerStore((state) => state.recentSongs);
  const playSong = usePlayerStore((state) => state.playSong);

  async function handleSearch() {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const response = await searchSongs(query);

      setSongs(response.data);
    } catch (error) {
      console.error(error);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "40px",
        paddingBottom: "170px",
      }}
    >
      <h1>🎵 Velvet</h1>

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      {recentSongs.length > 0 && (
        <>
          <h2>🕒 Recently Played</h2>

          <div
            style={{
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              marginBottom: "30px",
            }}
          >
            {recentSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => playSong(song)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                🎵 {song.title}
              </button>
            ))}
          </div>
        </>
      )}

      <SongList songs={songs} />
    </div>
  );
}

export default SearchPage;