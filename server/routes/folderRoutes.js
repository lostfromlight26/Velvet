import express from "express";

import {
  createFolderController,
  getFoldersController,
  deleteFolderController,
} from "../controllers/folderController.js";

const router = express.Router();

router.get("/", getFoldersController);

router.post("/", createFolderController);

router.delete("/:id", deleteFolderController);

export default router;