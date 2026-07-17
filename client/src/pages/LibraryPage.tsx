import FavoritesSection from "../components/library/FavoritesSection";
import PlaylistSection from "../components/library/PlaylistSection";
import RecentSection from "../components/library/RecentSection";

function LibraryPage() {
  return (
    <div className="min-h-full p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Your Library
        </h1>

        <p className="mt-2 text-zinc-400">
          Everything you love, all in one place.
        </p>
      </div>

      <div className="space-y-6">
        <FavoritesSection />
        <RecentSection />
        <PlaylistSection />
      </div>
    </div>
  );
}

export default LibraryPage;