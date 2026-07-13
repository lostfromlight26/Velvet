import { useState } from "react";

import SearchBar from "../components/SearchBar";
import SongList from "../components/SongList";

import { searchSongs } from "../services/musicService";
import type { Song } from "../types/song";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

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
        paddingBottom: "140px",
      }}
    >
      <h1>🎵 Velvet</h1>

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      <SongList songs={songs} />
    </div>
  );
}

export default SearchPage;