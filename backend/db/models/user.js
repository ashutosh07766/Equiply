const mongoose=require('mongoose')


let userSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,

    },

    password:{
        type:String,
        required:true,
    },
   phone:{
        type:Number,
        
     
    },
 
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const userModel=mongoose.model("User",userSchema);

module.exports=userModel