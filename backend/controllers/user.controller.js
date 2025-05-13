let {validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')
let userModel=require("../db/models/user.js")

const jwt=require('jsonwebtoken')
require('dotenv').config();


let signinUser=async (req,res)=>{
let errors=validationResult(req);
let body=req.body
if(!errors.isEmpty())
{
    return res.status(400).json({success:false,message:errors[0].msg})
}
let user= await userModel.findOne({email:body.email})
if(!user)
{
    return res.status(404).json({success:false,message:"User not found"})
}
const isMatch = await bcrypt.compare(body.password, user.password);
if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
}


else{
    const payload={
        userId:user._id,
        type:user.type||0,
        name:user.name
      }
      const tokenSecret=process.env.TOKEN_SECRET
    
     jwt.sign(payload,tokenSecret,{
          expiresIn:3600
      },(err,token)=>{
       if(err)
       {
return res.status(500).json({success:false,message:"Error"})
       }
       return res.status(200).json({success:true,token:token})
      })

}

}

let signupUser=async (req,res)=>{
    let errors=validationResult(req);
    let body=req.body
    if(errors&&errors.length)
    {
        res.status(400).json({success:false,message:errors[0].msg})
    }

    let existingUser= await userModel.findOne({email:body.email})

    if(existingUser)
    {
        res.status(404).json({success:false,message:"User already exists"})
    }

    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    
    let newUser = new userModel({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        phone: body.phone
    });
    await newUser.save()
    res.status(201).json({success:true,message:"User created successfully"})
}


let updateUser=async (req,res)=>{
    let email=req.params.email;
    let user= await userModel.findOne({email:email})
        if(!user){
            return res.status(404).send({success:false,"message":"User not found"})
        }
        let newPhone=req.body.phone;
        let newName=req.body.name;
     
        if(newName&&newName!=='')
        {
           await userModel.updateOne({email},{$set:{name:newName}})
        }
        if(newPhone&&newPhone!="")
            {
                await userModel.updateOne({email},{$set:{phone:newPhone}})
            }

            
        res.status(200).json({success:true,"message":"User updated successfully"})   


}


let deleteUser=async (req,res)=>{
 
let email=req.params.email;
let user=await userModel.findOne({email:email})
if(!user)
{
    return res.status(404).send({success:false,"message":"User not found"})
}
await userModel.deleteOne({email})
res.status(200).json({success:true,"message":"User deleted successfully"})

}


module.exports={
    updateUser,
    deleteUser,
    signinUser,
    signupUser

} 