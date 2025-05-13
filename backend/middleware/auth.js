const jwt=require('jsonwebtoken');

const tokenSecret=process.env.TOKEN_SECRET


module.exports=(req,res,next)=>{


    console.log(req.headers)
    console.log(req.header)


    const token=req.headers["x-access-token"];

    if(!token)
        return res.status(403).json({success:false,message:"No valid token found"})

    try{
        const decode=jwt.verify(token,tokenSecret)
        
        req.userId= decode.userId;
        next()
    }catch(err){
        return res.status(401).json({success:false,message:"Token is expired or corrupt"})
    }


}