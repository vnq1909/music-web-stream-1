import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import conn from "../config/db.js";
 
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
                token: generateToken(user._id)
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
//@route : POST /api/user/login
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
      playllists: []
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

// Tạo JWT cho người dùng 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    }