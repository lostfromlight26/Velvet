import express from "express";

import {
  createPlaylistController,
  getPlaylistsController,
  deletePlaylistController,
} from "../controllers/playlistController.js";

const router = express.Router();

router.get("/", getPlaylistsController);

router.post("/", createPlaylistController);

router.delete("/:id", deletePlaylistController);

export default router;