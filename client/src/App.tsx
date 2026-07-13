import SearchPage from "./pages/SearchPage";
import Player from "./components/Player";
import { PlayerProvider } from "./context/PlayerContext";

function App() {
  return (
    <PlayerProvider>
      <SearchPage />
      <Player />
    </PlayerProvider>
  );
}

export default App;