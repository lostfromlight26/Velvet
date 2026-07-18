import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Player from "./components/Player";

import { useFavoriteStore } from "./store/favoriteStore";

function App() {
  const loadFavorites = useFavoriteStore(
    (state) => state.loadFavorites
  );

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-[#09090B] text-white">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <MainContent />
          <Player />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;