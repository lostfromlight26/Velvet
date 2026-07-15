import express from "express";

import {
  saveFavorite,
  deleteFavorite,
  fetchFavorites,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.get("/", fetchFavorites);

router.post("/", saveFavorite);

router.delete("/:youtubeId", deleteFavorite);

export default router;