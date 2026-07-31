import { useEffect } from "react";
import { usePlayerStore } from "../store/playerStore";

export function useKeyboardShortcuts() {
  const { currentSong, isPlaying, pauseSong, resumeSong, playNext, playPrevious } =
    usePlayerStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      // Space = Play/Pause
      if (e.code === "Space") {
        e.preventDefault();
        if (currentSong) {
          if (isPlaying) {
            pauseSong();
          } else {
            resumeSong();
          }
        }
      }

      // Ctrl + Right / Cmd + Right = Next
      if ((e.ctrlKey || e.metaKey) && e.code === "ArrowRight") {
        e.preventDefault();
        playNext();
      }

      // Ctrl + Left / Cmd + Left = Previous
      if ((e.ctrlKey || e.metaKey) && e.code === "ArrowLeft") {
        e.preventDefault();
        playPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSong, isPlaying, pauseSong, resumeSong, playNext, playPrevious]);
}
