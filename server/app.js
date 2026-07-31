import express from "express";
import cors from "cors";

import searchRoutes from "./routes/searchRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";
import recentRoutes from "./routes/recentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://velvet-22606.web.app",
  "https://velvet-22606.firebaseapp.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS for public streaming API access
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "🎵 Velvet API is running",
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/search", searchRoutes);
app.use("/api/stream", streamRoutes);

app.use("/api/recent", recentRoutes);
app.use("/api/recents", recentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/playlists", playlistRoutes);

export default app;