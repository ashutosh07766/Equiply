const express=require('express');
const {check}=require('express-validator');   
const jwt=require('jsonwebtoken')

const {getAllProducts,product}=require('../controllers/products.controller.js');

const productRouter=express.Router();

productRouter.get('/',getAllProducts);
productRouter.get('/:id',product);

module.exports=productRouter;