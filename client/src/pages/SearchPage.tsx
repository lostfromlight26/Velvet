import { useEffect, useState } from "react";
import { Clock, X, Play, Heart, History, ListMusic, Sparkles, Search as SearchIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import SongList from "../components/SongList";
import SectionHeader from "../components/home/SectionHeader";
import RecentlyPlayed from "../components/home/RecentlyPlayed";
import { SongSkeleton } from "../components/ui/Skeleton";
import MagicBento from "../components/ui/MagicBento";
import BorderGlow from "../components/ui/BorderGlow";

import { searchSongs, getRecentSongs } from "../services/musicService";
import { usePlayerStore } from "../store/playerStore";
import { useFavoriteStore } from "../store/favoriteStore";
import { usePlaylistStore } from "../store/playlistStore";
import { useSearchHistoryStore } from "../store/searchHistoryStore";
import { useToastStore } from "../store/toastStore";
import type { Song } from "../types/song";

function parseDurationToSeconds(durationStr: string): number {
  if (!durationStr) return 0;
  const parts = durationStr.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const { recentSongs, setRecentSongs, playbackProgress, playSong } = usePlayerStore();
  const favorites = useFavoriteStore((state) => state.favorites);
  const playlists = usePlaylistStore((state) => state.playlists);
  const { history, removeSearch, clearHistory } = useSearchHistoryStore();
  const { showToast } = useToastStore();

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

  useEffect(() => {
    async function executeSearch(searchTerm: string) {
      if (!searchTerm.trim()) {
        setSongs([]);
        return;
      }

      try {
        setLoading(true);
        const response = await searchSongs(searchTerm.trim());
        setSongs(response.data || []);
      } catch (error) {
        console.error(error);
        showToast("Search failed", "error");
      } finally {
        setLoading(false);
      }
    }

    executeSearch(queryParam);
  }, [queryParam, showToast]);

  const continueListeningSongs = recentSongs.filter(
    (s) => playbackProgress[s.id] && playbackProgress[s.id] > 5
  );

  const bentoCards = [
    {
      title: "Liked Songs",
      description: `${favorites.length} saved tracks`,
      label: "Collection",
      color: "#120F17",
      onClick: () => navigate("/liked"),
      icon: <Heart size={20} className="text-rose-400" fill="currentColor" />,
    },
    {
      title: "Recently Played",
      description: `${recentSongs.length} tracks in history`,
      label: "Activity",
      color: "#120F17",
      onClick: () => {
        if (recentSongs.length > 0) playSong(recentSongs[0]);
      },
      icon: <History size={20} className="text-violet-400" />,
    },
    {
      title: "Your Playlists",
      description: `${playlists.length} playlists created`,
      label: "Library",
      color: "#120F17",
      onClick: () => navigate("/playlists"),
      icon: <ListMusic size={20} className="text-purple-400" />,
    },
  ];

  const [mobileSearchInput, setMobileSearchInput] = useState(queryParam);

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchInput.trim()) {
      setSearchParams({ q: mobileSearchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="pb-16 md:pb-24">
      {/* Mobile-Only Search Bar */}
      <div className="block md:hidden mb-6">
        <form onSubmit={handleMobileSearchSubmit} className="relative w-full">
          <SearchIcon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search songs, artists, or albums..."
            value={mobileSearchInput}
            onChange={(e) => setMobileSearchInput(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-10 py-3 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none"
          />
          {mobileSearchInput && (
            <button
              type="button"
              onClick={() => {
                setMobileSearchInput("");
                setSearchParams({});
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>

      {/* Top Quick Access Bento Grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Sparkles size={20} className="text-violet-400" />
              Quick Access
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Jump right back into your music</p>
          </div>
        </div>

        <MagicBento
          cards={bentoCards}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableStars={true}
          glowColor="168, 85, 247"
        />
      </section>

      {/* Search History Tags */}
      {history.length > 0 && (
        <div className="mt-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Clock size={14} />
              Recent Searches
            </div>
            <button
              onClick={clearHistory}
              className="text-xs text-zinc-500 hover:text-red-400 transition"
            >
              Clear All
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {history.map((term) => (
              <div
                key={term}
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-zinc-900/80
                  px-3
                  py-1.5
                  text-sm
                  text-zinc-300
                  transition
                  hover:border-violet-500/50
                  hover:bg-zinc-800
                  hover:text-white
                "
              >
                <button
                  onClick={() => {
                    setSearchParams({ q: term });
                  }}
                  className="truncate max-w-[200px]"
                >
                  {term}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSearch(term);
                  }}
                  className="text-zinc-500 hover:text-red-400 transition"
                  title="Remove search"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results / Discovery Section */}
      {queryParam.trim() ? (
        <section className="mb-12">
          <SectionHeader
            title={`Search Results for "${queryParam}"`}
            subtitle="Top track matches"
          />

          {loading ? (
            <div className="mt-4">
              <SongSkeleton />
              <SongSkeleton />
              <SongSkeleton />
              <SongSkeleton />
            </div>
          ) : songs.length > 0 ? (
            <SongList songs={songs} />
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-white/5 bg-zinc-900/40">
              <SearchIcon size={40} className="text-zinc-600 mb-3" />
              <h3 className="text-lg font-bold text-white">No results found</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Try searching for a different song title or artist name using the top header search bar.
              </p>
            </div>
          )}
        </section>
      ) : null}

      {/* Continue Listening Section */}
      {continueListeningSongs.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            title="Continue Listening"
            subtitle="Pick up right where you left off"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {continueListeningSongs.slice(0, 4).map((song) => {
              const currentProgress = playbackProgress[song.id] || 0;
              const totalSecs = parseDurationToSeconds(song.duration);
              const progressPct = totalSecs > 0 ? Math.min(100, (currentProgress / totalSecs) * 100) : 0;

              return (
                <BorderGlow
                  key={song.id}
                  borderRadius={20}
                  glowColor="270 85 65"
                  backgroundColor="#120F17"
                  className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                >
                  <div
                    onClick={() => playSong(song, currentProgress)}
                    className="p-4 flex flex-col"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-800 mb-3">
                      <img src={song.thumbnail} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white shadow-lg">
                          <Play size={18} fill="white" className="ml-0.5" />
                        </div>
                      </div>
                    </div>

                    <h4 className="truncate font-semibold text-white group-hover:text-violet-300 text-sm">
                      {song.title}
                    </h4>
                    <p className="truncate text-xs text-zinc-400 mt-0.5">{song.artist}</p>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-violet-500 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </BorderGlow>
              );
            })}
          </div>
        </section>
      )}

      {recentSongs.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            title="Recently Played"
            subtitle="Jump back into your favorites"
          />

          <RecentlyPlayed />
        </section>
      )}

      {!queryParam.trim() && (
        <section>
          <SectionHeader
            title="Recommended for You"
            subtitle="Discover your next favorite track"
          />

          {loading ? (
            <div className="mt-4">
              <SongSkeleton />
              <SongSkeleton />
              <SongSkeleton />
              <SongSkeleton />
            </div>
          ) : (
            <SongList songs={songs} />
          )}
        </section>
      )}
    </div>
  );
}

export default SearchPage;