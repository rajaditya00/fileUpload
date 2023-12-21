const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

require('dotenv').config();

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,

    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    },
    videoUrl:{
        type:String,
    }
});

//post middleware ka use , one other exist named pre middleware

 fileSchema.post("save", async function(doc){
    try{
        console.log("DOC :", doc);

        // transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })

        //send mail

        let info = await transporter.sendMail({
            from:'moxie - by aditya',
            to:doc.email,
            subject:"new file uploaded in cloudinary",
            html:`<h2>Hello jee</h2><p>File uploaded , view here : <a href ="${doc.imageUrl}" >${doc.imageUrl}</a></p>`
        })

        console.log("info is : ",info);
  


    }catch(error){
        console.error(error)
    }
 })

const File = mongoose.model("File",fileSchema);
module.exports =File;



 