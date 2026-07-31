import { searchSongs } from "../services/searchService.js";

export async function search(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const songs = await searchSongs(q);

    res.json({
      success: true,
      count: songs.length,
      data: songs
    });

  } catch (error) {
    console.error("Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while searching.",
    });
  }
}