require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.route.js');


require('./db/models/connection.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/user', userRouter);

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Page not found" });
});

app.listen(8080, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(' Server is running on port 8080');
});