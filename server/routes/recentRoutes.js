import express from "express";
import {
  saveRecent,
  fetchRecent,
} from "../controllers/recentController.js";

const router = express.Router();

router.get("/", fetchRecent);

router.post("/", saveRecent);

export default router;