
// app create
const express = require('express');
const app = express();

//port find
require('dotenv').config();
const PORT = process.env.PORT || 4000;

//middleware addition
app.use(express.json());
const fileupload = require('express-fileupload');
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//db se connection
const db = require('./config/database');
db.connect();

//cloud se connection
const cloudinary = require('./config/cloudinary');
cloudinary.cloudinaryConnect();

//api route mount
const Upload = require('./routes/FileUpload');
app.use('/api/v1/upload' , Upload)

//server activation
app.listen(PORT ,() =>{
    console.log(`App is running successfully at ${PORT}`);
})