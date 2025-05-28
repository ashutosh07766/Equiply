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

const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: errors.array()
            });
        }

        const {
            name,
            description,
            price,
            category,
            location,
            availability,
            renting
        } = req.body;

        const newProduct = new productModel({
            name,
            description,
            price,
            category,
            images: req.body.images || "https://via.placeholder.com/500x300?text=No+Image+Available",
            seller: req.userId,
            location,
            availability: availability || "Available",
            renting: renting || {
                days: price
            }
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating product"
        });
    }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await productModel.find({ isFeatured: true });
        
        if (featuredProducts.length === 0) {
            // If no featured products, return the first 4 products
            const defaultProducts = await productModel.find().limit(4);
            return res.status(200).json({
                success: true,
                featuredProducts: defaultProducts
            });
        }
        
        return res.status(200).json({
            success: true,
            featuredProducts: featuredProducts
        });
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching featured products"
        });
    }
};

let searchProducts = async (req, res) => {
    try {
        console.log('Search query parameters:', req.query);
        const { search, category, page = 1, limit = 10 } = req.query;
        let query = {};

        // Add search condition if search term exists
        if (search && search.trim()) {
            query.name = { $regex: search.trim(), $options: 'i' }; // Case-insensitive search
        }

        // Add category filter if category exists
        if (category && category.trim()) {
            // Handle multiple categories if they're comma-separated
            const categories = category.split(',').map(cat => cat.trim());
            // Use $in operator to match any of the selected categories
            query.category = { $in: categories };
            console.log('Category filter:', categories);
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        console.log('MongoDB query:', query);
        console.log('Pagination params:', { skip, limit: parseInt(limit) });
        
        // Get total count of matching products
        const totalProducts = await productModel.countDocuments(query);
        
        // Get paginated products
        const products = await productModel.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }); // Sort by newest first
            
        console.log('Found products:', products.length);
        console.log('Total products:', totalProducts);

        const totalPages = Math.ceil(totalProducts / parseInt(limit));
        console.log('Total pages:', totalPages);

        // Always return success with empty array if no products found
        return res.status(200).json({
            success: true,
            products: products || [],
            pagination: {
                currentPage: parseInt(page),
                totalPages: totalPages || 1,
                totalProducts: totalProducts,
                productsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error in searchProducts:', error);
        return res.status(500).json({
            success: false,
            message: "Server error while searching products",
            error: error.message
        });
    }
};

module.exports={
    getAllProducts,
    product,
    createProduct,
    getFeaturedProducts,
    searchProducts
}