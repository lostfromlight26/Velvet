import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import MainContent from "./components/MainContent";
import Player from "./components/Player";
import MobileNav from "./components/MobileNav";

import { useFavoriteStore } from "./store/favoriteStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

import ToastContainer from "./components/ui/ToastContainer";
import SplashCursor from "./components/ui/SplashCursor";
import ClickSpark from "./components/ui/ClickSpark";
import LightRays from "./components/ui/LightRays";

function App() {
  useKeyboardShortcuts();

  const loadFavorites = useFavoriteStore((state) => state.loadFavorites);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    loadFavorites();

    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.innerWidth < 768
      );
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, [loadFavorites]);

  return (
    <BrowserRouter>
      <ClickSpark sparkColor="#A855F7" sparkCount={10} sparkRadius={20}>
        {/* SplashCursor disabled on touch/mobile devices */}
        {!isTouchDevice && <SplashCursor COLOR="#A855F7" />}

        <ToastContainer />

        <div className="relative flex h-screen overflow-hidden bg-[#09090B] text-white">
          {/* Ambient Background Light Rays */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
            <LightRays raysColor="#A855F7" raysSpeed={0.8} lightSpread={0.7} followMouse={true} />
          </div>

          <Sidebar />

          <div className="relative z-50 flex flex-1 flex-col overflow-hidden">
            <TopBar />
            <MainContent />
            <Player />
            <MobileNav />
          </div>
        </div>
      </ClickSpark>
    </BrowserRouter>
  );
}

export default App;