const jwt=require('jsonwebtoken');
const User = require('../db/models/user.js');

const tokenSecret=process.env.TOKEN_SECRET

module.exports=async (req,res,next)=>{
    console.log(req.headers)
    console.log(req.header)

    const token=req.headers["x-access-token"];

    if(!token)
        return res.status(403).json({success:false,message:"No valid token found"})

    try{
        const decode=jwt.verify(token,tokenSecret)
        
        req.userId= decode.userId;

        // Check if user is banned
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.status === "banned") {
            return res.status(403).json({
                success: false,
                message: "Your account has been banned. Please contact support."
            });
        }
        
        next();
    }catch(err){
        return res.status(401).json({success:false,message:"Token is expired or corrupt"})
    }
}