let {validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')
let productModel=require("../db/models/seedproduct.js")

const jwt=require('jsonwebtoken');

require('dotenv').config();


let getAllProducts=async (req,res)=>{
    let products=await productModel.find()
    if(!products)
    {
        return res.status(404).json({success:false,message:"No products found"})
    }
    return res.status(200).json({success:true,products:products})
}

let product=async (req,res)=>{
    let id=req.params.id
    let product=await productModel.findById(id)
    if(!product)
    {
        return res.status(404).json({success:false,message:"No products found"})
    }
    return res.status(200).json({success:true,product:product})
}



module.exports={
getAllProducts,
product

} 