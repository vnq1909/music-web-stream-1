import conn from "../config/db.js";
import fs from "fs";
import mongodb from "mongodb";

// @desc    Thêm một bài hát mới
// @route   POST /api/v1/song/upload
// @access  Private
export const addSong = async (req, res) => {
  try {
    // Lấy dữ liệu từ phần body của request
    const { title, artist, album, description } = req.body;

    // Nếu một trong các trường trống, ném ra một lỗi
    if (!title || !artist || !album || !description) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    // Kết nối đến cơ sở dữ liệu
    const db = conn.db("music_streaming");
    const collection = db.collection("songs");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    // Tải file lên cơ sở dữ liệu
    const readStream = fs
      .createReadStream(req.file.path)
      .pipe(bucket.openUploadStream(req.file.filename));

    // Nếu có lỗi, ném ra một lỗi
    readStream.on("error", (error) => {
      throw error;
    });

     // Nếu file được tải lên thành công, xóa file từ thư mục uploads
    // và chèn dữ liệu bài hát vào cơ sở dữ liệu
    readStream.on("finish", async () => {
      console.log("finished");
      const song = await collection.insertOne({
        title,
        artist,
        album,
        description,
        uploadedBy: req.userId,
        song: req.file.filename,
        file: readStream.id,
      });
      if (song) {
        res
          .status(201)
          .json({ message: "Song added successfully", status: "success" });
      } else {
        res.status(400);
        throw new Error("Invalid song data");
      }
    });
  } catch (error) {
    console.log(error);
    
    return res.json({ error: error.message });
  }
};

//@desc   Xóa một bài hát
//@route  DELETE /api/v1/song/delete/:id
//@access Private
export const deleteSong = async (req, res) => {
  try {
    console.log("hitting the server");
    console.log(req.query.file);
    const { id } = req.params;
    if (!id) {
      res.status(400);
      throw new Error("No id provided");
    }
   
    const db = conn.db("music_streaming");
    const collection = db.collection("songs");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    const song = await collection.findOne({ _id: new mongodb.ObjectId(id) });
    if (!song) {
      res.status(404);
      throw new Error("Song not found");
    }
    if (song.uploadedBy !== req.userId) {
      res.status(401);
      throw new Error("Unauthorized");
    }
    const deleteSong = await collection.deleteOne({
      _id: new mongodb.ObjectId(id),
    });
    if (deleteSong) {
      await bucket.delete(new mongodb.ObjectId(req.query.file));
      res
        .status(200)
        .json({ message: "Song deleted successfully", status: "success" });
    } else {
      res.status(400);
      throw new Error("Error deleting song");
    }
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message, status: "error" });
  }
};

// @desc    Lấy tất cả các bài hát
// @route   GET /api/v1/songs
// @access  Public
export const getSongs = async (req, res) => {
  try {
   
    const db = conn.db("music_streaming");
    const collection = db.collection("songs");
    const songs = await collection.find({}).toArray();
    if (songs.length === 0) {
      res.status(404);
      throw new Error("No songs found");
    }
    res.status(200).json({ songs });
  } catch (error) {
    console.log(error);
    return res.json({ error: error.message, status: "error" });
  }
};

// @desc: Phát một bài hát
// @route : GET /api/v1/song/download/:filename
// @access  Public
export const streamSong = async (req, res) => {
  try {
    // Nếu không có tên file được cung cấp, ném ra một lỗi
    if (!req.params.filename) {
      res.status(400);
      throw new Error("No file name provided");
    }
    // Kết nối đến cơ sở dữ liệu và lấy file từ cơ sở dữ liệu
    
    const db = conn.db("music_streaming");
    const bucket = new mongodb.GridFSBucket(db, {
      bucketName: "uploads",
    });

    // Thiết lập  nội dung của file


    // Phát file nhạc đến client
    const downloadStream = bucket.openDownloadStreamByName(req.params.filename).pipe(res).on("error", (error) => { throw error; });
    
    downloadStream.on("end", () => {
      res.end();
    });

    // Nếu có lỗi, ném ra một lỗi
  } catch (error) {
    console.log(error.message);
    return res.json({ error: error.message, status: "error" });
  }
};
