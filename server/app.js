import express from "express";
import cors from "cors";

import searchRoutes from "./routes/searchRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";
import recentRoutes from "./routes/recentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "🎵 Velvet API is running",
  });
});

app.use("/api/search", searchRoutes);
app.use("/api/stream", streamRoutes);

app.use("/api/recent", recentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/playlists", playlistRoutes);

export default app;