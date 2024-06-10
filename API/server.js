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
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('../dist'))

// Thêm các ROUTES vào ứng dụng
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/song", userJwtMiddleware, songRoutes);
app.use("/api/v1/playlist",userJwtMiddleware, playlistRoutes);
// Các routes chung
app.get("/api/v1/stream/:filename", streamSong);
app.get('/api/v1/songs',getSongs)

console.log(path.resolve('../dist/index.html'))
app.get("*", (req, res) => {
  res.sendFile(path.resolve('../dist/index.html'));
});
 
// Lắng nghe máy chủ
app.listen(1337, () => {
  console.log(`Server is running at http://localhost:5173`);
});