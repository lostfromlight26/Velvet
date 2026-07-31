import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SongSkeleton } from "./ui/Skeleton";

const SearchPage = lazy(() => import("../pages/SearchPage"));
const LibraryPage = lazy(() => import("../pages/LibraryPage"));
const PlaylistPage = lazy(() => import("../pages/PlaylistPage"));
const LikedSongsPage = lazy(() => import("../pages/LikedSongsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

function PageLoader() {
  return (
    <div className="p-6 space-y-4">
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
    </div>
  );
}

function MainContent() {
  const location = useLocation();

  return (
    <main className="flex-1 overflow-y-auto bg-[#09090B] px-4 sm:px-8 md:px-10 pt-6 pb-52 scrollbar-thin">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full h-full"
        >
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/" element={<SearchPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/liked" element={<LikedSongsPage />} />
              <Route path="/playlists" element={<PlaylistPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default MainContent;