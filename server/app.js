import express from "express";
import cors from "cors";

import searchRoutes from "./routes/searchRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";

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

export default app;