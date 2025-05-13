require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.route.js');

const productRouter = require('./routes/allproducts.route.js');

const connectDB=require('./db/models/connection.js');
connectDB();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/product', productRouter);
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Page not found" });
});

app.listen(2000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(' Server is running on port 2000');
});