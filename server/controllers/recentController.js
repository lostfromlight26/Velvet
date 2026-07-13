import {
  addRecentSong,
  getRecentSongs,
} from "../services/recentService.js";

export async function saveRecent(req, res) {
  try {
    const song = await addRecentSong(req.body);

    res.status(201).json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save recent song",
    });
  }
}

export async function fetchRecent(req, res) {
  try {
    const songs = await getRecentSongs();

    res.json({
      success: true,
      data: songs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent songs",
    });
  }
}