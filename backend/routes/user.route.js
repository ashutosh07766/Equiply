const express=require('express');
const {check}=require('express-validator');   
const jwt=require('jsonwebtoken')
const auth =require('../middleware/auth.js')
const isAdmin=require('../middleware/isAdmin.js')
const {
    updateUser,
    deleteUser,
    signinUser,
    signupUser,
    getUserAddresses,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress
} = require('../controllers/user.controller.js');

const userRouter=express.Router();

userRouter.post('/signin',[
    check('email').not().normalizeEmail(),
    check('password').not()
],signinUser)

userRouter.post('/signup',[
    check('email').not().normalizeEmail(),
    check('password').notEmpty()
],signupUser)

// Address management routes
userRouter.get('/addresses', auth, getUserAddresses);
userRouter.post('/address', auth, [
    check('label').notEmpty().withMessage('Address label is required'),
    check('address').notEmpty().withMessage('Full address is required'),
    check('phone').notEmpty().withMessage('Phone number is required')
], addUserAddress);
userRouter.put('/address/:addressId', auth, updateUserAddress);
userRouter.delete('/address/:addressId', auth, deleteUserAddress);
userRouter.put('/default-address', auth, setDefaultAddress);

userRouter.patch('/:email',updateUser)
userRouter.delete('/:email',deleteUser)

module.exports=userRouter;