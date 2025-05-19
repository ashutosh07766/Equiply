const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth.js');
const isAdmin = require('../middleware/isAdmin.js');
const { 
    getDashboardStats,
    getAllUsers,
    manageUser,
    getAllOrders,
    updateOrderStatus,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    setFeaturedProducts
} = require('../controllers/admin.controller.js');

const adminRouter = express.Router();

// All routes require authentication and admin privileges
adminRouter.use(auth);
adminRouter.use(isAdmin);

// Dashboard stats
adminRouter.get('/dashboard', getDashboardStats);

// User management
adminRouter.get('/users', getAllUsers);
adminRouter.patch('/user/:userId', [
    check('action').isIn(['ban', 'delete']).withMessage('Invalid action')
], manageUser);

// Order management
adminRouter.get('/orders', getAllOrders);
adminRouter.patch('/order/:orderId', [
    check('status').isIn(['pending', 'paid', 'cancelled', 'delivered']).withMessage('Invalid order status')
], updateOrderStatus);

// Product management
adminRouter.get('/products', getAllProducts);
adminRouter.patch('/product/:productId', updateProduct);
adminRouter.delete('/product/:productId', deleteProduct);

// Featured products
adminRouter.get('/featured-products', getFeaturedProducts);
adminRouter.post('/set-featured', setFeaturedProducts);

module.exports = adminRouter;
