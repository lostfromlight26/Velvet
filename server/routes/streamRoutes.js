import express from "express";
import { stream } from "../controllers/streamController.js";

const router = express.Router();

router.get("/:videoId", stream);

export default router;