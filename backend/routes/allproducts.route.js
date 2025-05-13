const express=require('express');
const {check}=require('express-validator');   
const jwt=require('jsonwebtoken')

const {getAllProducts}=require('../controllers/products.controller.js');

const productRouter=express.Router();

productRouter.get('/',getAllProducts);

module.exports=productRouter;