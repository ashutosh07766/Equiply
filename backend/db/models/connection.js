const mongoose=require('mongoose')
require('dotenv').config();

let mongoURL=process.env.MONGO_URL||'mongodb://localhost:27017/'
mongoose.connect(mongoURL)
.then(()=>{console.log('Connected! to database')})

