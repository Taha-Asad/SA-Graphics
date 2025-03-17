const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db.js')

const port = process.env.PORT;












//SA-graphics
app.listen(port ,(req , res)=>{
    console.log(`Server is running on port ${port}`);
    connectDB();
});