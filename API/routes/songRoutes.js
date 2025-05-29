import express from "express";
import multer from "multer";
import {
  streamSong,
  addSong,
  deleteSong,
  getSongs,
  getSongDetails,
  editSong,
} from "../controllers/songController.js";
import { userJwtMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Protected routes that require authentication
router.use(userJwtMiddleware);

// Admin-only routes
router.put("/edit/:id", adminMiddleware, editSong);
router.delete("/delete/:id", adminMiddleware, deleteSong);

// User routes
router.post("/upload", upload.single("file"), addSong);

// Public routes
router.get("/songs", getSongs);
router.get("/:id", getSongDetails);

export default router;
