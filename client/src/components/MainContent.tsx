import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import SearchPage from "../pages/SearchPage";
import LibraryPage from "../pages/LibraryPage";
import PlaylistPage from "../pages/PlaylistPage";
import LikedSongsPage from "../pages/LikedSongsPage";
import SettingsPage from "../pages/SettingsPage";

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
          <Routes location={location}>
            <Route path="/" element={<SearchPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/liked" element={<LikedSongsPage />} />
            <Route path="/playlists" element={<PlaylistPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default MainContent;