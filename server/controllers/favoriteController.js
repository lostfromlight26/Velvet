import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/favoriteService.js";

export async function saveFavorite(req, res) {
  try {
    const favorite = await addFavorite(req.body);

    res.json({
      success: true,
      data: favorite,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save favorite",
    });
  }
}

export async function deleteFavorite(req, res) {
  try {
    await removeFavorite(req.params.youtubeId);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove favorite",
    });
  }
}

export async function fetchFavorites(req, res) {
  try {
    const favorites = await getFavorites();

    res.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch favorites",
    });
  }
}