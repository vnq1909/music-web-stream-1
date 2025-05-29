import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Import các route
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import { getSongs, streamSong } from "./controllers/songController.js"; //generic functions
import {userJwtMiddleware} from "./middlewares/authMiddleware.js"; // auth middleware
import conn from "./config/db.js"; // database connection

dotenv.config();
const app = express();

/// MIDDLEWARES
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));

// API ROUTES - Đặt trước static files và catch-all route
// Các routes chung
app.get("/api/v1/stream/:filename", streamSong);
app.get('/api/v1/songs', getSongs);

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Protected routes
app.use("/api/v1/song", songRoutes);
app.use("/api/v1/playlist", userJwtMiddleware, playlistRoutes);

// STATIC FILES - Đặt sau API routes
app.use(express.static('../dist'));

// Catch-all route - Luôn đặt cuối cùng
app.get("*", (req, res) => {
  res.sendFile(path.resolve('../dist/index.html'));
});
 
// Lắng nghe máy chủ
const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API routes are mounted at /api/v1/`);
});