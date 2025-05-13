const express=require('express');
const {check}=require('express-validator');   
const jwt=require('jsonwebtoken')
const auth =require('../middleware/auth.js')
const isAdmin=require('../middleware/isAdmin.js')
const {updateUser,deleteUser,signinUser,signupUser}=require('../controllers/user.controller.js');
const userRouter=express.Router();

userRouter.post('/signin',[
    check('email').not().normalizeEmail(),
    check('password').not()
],signinUser)

userRouter.post('/signup',[
    check('email').not().normalizeEmail(),
    check('password').notEmpty()
],signupUser)



userRouter.patch('/:email',updateUser)

userRouter.delete('/:email',deleteUser)

module.exports=userRouter;