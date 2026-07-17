import { Routes, Route } from "react-router-dom";

import SearchPage from "../pages/SearchPage";
import LibraryPage from "../pages/LibraryPage";
import PlaylistPage from "../pages/PlaylistPage";
import SettingsPage from "../pages/SettingsPage";

function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto bg-[#09090B] px-10 py-8">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/playlists" element={<PlaylistPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </main>
  );
}

export default MainContent;