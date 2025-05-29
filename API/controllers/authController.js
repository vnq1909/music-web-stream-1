import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import conn from "../config/db.js";
import { ObjectId } from 'mongodb';

// @desc    Đăng nhập người dùng
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => { 
    try{
        const {email,password} = req.body;

        // Nếu một trong các trường trống
        if (!email || !password) {
            res.status(400)
            throw new Error("Please add all fields");
        }

        const db = conn.db('music_streaming');
        const collection = db.collection('users');
        // Kiểm tra xem người dùng tồn tại hay không
        const user = await collection.findOne({ email });
        if (!user) {
            res.status(400)
            throw new Error("User does not exists");
        }
        if(user && bcrypt.compareSync(password,user.password)){
            res.status(200).json({
                message:'User logged in',
                status:'success',
                token: generateToken(user._id, user.isAdmin || false),
                isAdmin: user.isAdmin || false
            })
        }
        else{ 
            res.status(400)
            throw new Error('Invalid credentials')
        }


    }
    catch(err){
        res.send(err.message)
    }

};


//@desc: Đăng ký người dùng mới
//@route : POST /api/
//@access  Public
export const register = async (req, res) => {
  try {

    // Lấy thông tin của request
    const { fullName, email, password } = req.body;

      // Nếu một trong các trường trống
    if (!fullName || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const db = conn.db('music_streaming');
    const collection = db.collection('users');

    // Kiểm tra xem người dùng đã tồn tại hay chưa
    const userExists = await collection.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const user = await collection.insertOne({
      fullName,
      email,
      password: hashedPassword,
      playllists: [],
      isAdmin: false
    });
    if (user) {
      res.status(201).json({
        message: "user registered",
        status: "success", 
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (err) {
    console.log(err.message);
    return res.send(err.message);
  }
};

// @desc    Lấy danh sách người dùng và bài hát của họ
// @route   GET /api/auth/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    const db = conn.db('music_streaming');
    const usersCollection = db.collection('users');
    const songsCollection = db.collection('songs');
    
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    
    // Lấy bài hát cho mỗi user
    const usersWithSongs = await Promise.all(users.map(async (user) => {
      const userSongs = await songsCollection.find({ uploadedBy: user._id.toString() }).toArray();
      return {
        ...user,
        songs: userSongs
      };
    }));

    res.status(200).json(usersWithSongs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Xóa người dùng
// @route   DELETE /api/auth/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    const db = conn.db('music_streaming');
    const collection = db.collection('users');
    
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo JWT cho người dùng 
const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}