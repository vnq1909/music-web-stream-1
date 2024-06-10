import express from 'express'
import { addPlaylist,deletePlaylist,addSongToPlaylist,removeSongFromPlaylist,getPlaylists,getPlaylist } from '../controllers/playlistController.js';
const router = express.Router();

router.get('/',getPlaylists); // Lấy tất cả danh sách phát
router.get('/:id',getPlaylist) // Lấy một danh sách phát cụ thể
router.post('/create', addPlaylist); // Tạo danh sách phát mới
router.delete('/delete/:id', deletePlaylist); // Xóa một danh sách phát
router.post('/add/:id', addSongToPlaylist); // Thêm bài hát vào danh sách phát
router.delete('/remove/:id', removeSongFromPlaylist); // Xóa bài hát khỏi danh sách phát

export default router