const express = require('express');
const router = express.Router();
const productController = require('../controllers/products.controller');

// Get all products
router.get('/', productController.getAllProducts);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Search products
router.get('/search', productController.searchProducts);

// Get product by ID
router.get('/:id', productController.product);

// Create new product
router.post('/', productController.createProduct);

module.exports = router; 