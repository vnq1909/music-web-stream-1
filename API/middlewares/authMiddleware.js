import jwt from 'jsonwebtoken'

// Middleware kiểm tra JWT của người dùng
export const userJwtMiddleware = (req,res,next)=>{
    // Lấy token từ header của request
    const token = req.header('x-auth-token');
    if(!token){
        // Nếu không có token, trả về lỗi 401 và thông báo
        return res.status(401).json({msg:'No token, authorization denied'})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }catch(err){
        res.status(401).json({msg:'Token is not valid'})
    }
}