let {validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')
let productModel=require("../db/models/seedproduct.js")
let Review = require("../db/models/review.js")

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
    try {
        let id=req.params.id
        let product=await productModel.findById(id)
        
        if(!product)
        {
            return res.status(404).json({success:false,message:"No products found"})
        }
        
        // Get review statistics for the product
        const reviews = await Review.find({ productId: id }).sort({ date: -1 });
        let totalRating = 0;
        const ratingCounts = {
            5: 0, 4: 0, 3: 0, 2: 0, 1: 0
        };
        
        reviews.forEach(review => {
            totalRating += review.rating;
            ratingCounts[review.rating] += 1;
        });
        
        const averageRating = reviews.length > 0 
            ? (totalRating / reviews.length).toFixed(1) 
            : 0;
        
        // Include the top 3 most recent reviews
        const recentReviews = reviews.slice(0, 3);
        
        return res.status(200).json({
            success:true,
            product: product,
            reviewStats: {
                totalReviews: reviews.length,
                averageRating: parseFloat(averageRating),
                ratingDistribution: ratingCounts
            },
            recentReviews: recentReviews
        })
    } catch (error) {
        console.error('Error fetching product details:', error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching product details"
        });
    }
}



module.exports={
getAllProducts,
product
}