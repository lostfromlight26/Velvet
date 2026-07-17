import { useEffect, useState } from "react";

import SearchBar from "../components/SearchBar";
import SongList from "../components/SongList";

import SectionHeader from "../components/home/SectionHeader";
import RecentlyPlayed from "../components/home/RecentlyPlayed";

import {
  searchSongs,
  getRecentSongs,
} from "../services/musicService";

import { usePlayerStore } from "../store/playerStore";

import type { Song } from "../types/song";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const recentSongs = usePlayerStore((state) => state.recentSongs);
  const setRecentSongs = usePlayerStore((state) => state.setRecentSongs);

  useEffect(() => {
    async function loadRecentSongs() {
      try {
        const response = await getRecentSongs();

        const mappedSongs: Song[] = response.data.map((song: any) => ({
          id: song.youtubeId,
          title: song.title,
          artist: song.artist,
          thumbnail: song.thumbnail,
          duration: song.duration,
        }));

        setRecentSongs(mappedSongs);
      } catch (error) {
        console.error("Failed to load recent songs", error);
      }
    }

    loadRecentSongs();
  }, [setRecentSongs]);

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
    <div className="pb-44">
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      {recentSongs.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            title="Recently Played"
            subtitle="Jump back into your favorites"
          />

          <RecentlyPlayed />
        </section>
      )}

      <section>
        <SectionHeader
          title="Recommended for You"
          subtitle="Discover your next favorite track"
        />

        <SongList songs={songs} />
      </section>
    </div>
  );
}

export default SearchPage;