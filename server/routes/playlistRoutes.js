import express from "express";

import {
  createPlaylistController,
  getPlaylistsController,
  getPlaylistByIdController,
  renamePlaylistController,
  addSongToPlaylistController,
  removeSongFromPlaylistController,
  deletePlaylistController,
} from "../controllers/playlistController.js";

const router = express.Router();

router.get("/", getPlaylistsController);
router.post("/", createPlaylistController);
router.get("/:id", getPlaylistByIdController);
router.put("/:id", renamePlaylistController);
router.delete("/:id", deletePlaylistController);

router.post("/:id/songs", addSongToPlaylistController);
router.delete("/:id/songs/:songId", removeSongFromPlaylistController);

export default router;