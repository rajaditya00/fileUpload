const File = require('../models/File');
const cloudinary = require('cloudinary').v2;

//localFileUpload  -> handler function

exports.localFileUpload = async(req, res) =>{
    try{
        //fetch file from req
        const file = req.files.file;
        console.log("your file is" , file);
        

        //create path while file needs to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`
        console.log("path is  ->" , path);
        

        //add path to the move function
        file.mv(path , (error) =>{
            console.log(error);
        });
        

        //create a successful response
        res.json({
            success:true,
            message: "Local file uploaded successfully",
        })

    }catch(error){
        console.log("Not able to upload the file on server")
         console.log(error);
    }
}




function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file,folder){
    const option ={folder}
    console.log("temp file path is  -> ", file.tempFilePath);
    return await cloudinary.uploader.upload(file.tempFilePath , option);
           
}

// image upload ka handler

exports.imageUpload =  async(req,res) =>{
    try{
        //data fetch
        const {name, tags, email,} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpeg", "png","jpg"];
        const fileType =file.name.split('.')[1].toLowerCase();
        console.log("fileType is  -> ",fileType);

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:`File formate not supported`,
            })
        }

       //file formate supported
       console.log("uploading to CloudImg");
       const response = await uploadFileToCloudinary(file,"CloudImg");
       console.log("response is -> ",response);
       
       //save entry in db

       const fileData = await File.create({
        name,
        email,
        tags,
        imageUrl : response.secure_url,
       })


    res.json({
        success:true,
        imageUrl : response.secure_url,
        message:`Image successfully Uploaded`,

    })

    }catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:`somthing went wrong`,
        })

    }
}

function isSupportedVdoFileType(type,supportedVdoFileType){
    return supportedVdoFileType.includes(type);
}

async function uploadVdoFileToCloudinary(file, folder){
    const option ={folder}
    console.log("temp file path is  -> ", file.tempFilePath);
    option.resource_type ="auto";
    return await cloudinary.uploader.upload(file.tempFilePath,option);
}

//video Upload handler

exports.videoUpload = async (req, res) =>{
    try{
        //data fetch
        const{name,email,tags} = req.body;
        console.log("req.body ->", name, tags, email);

        const file = req.files.vdoFile;
        console.log("file is ->", file);

        //validation
        const supportedVdoFileType = ["mp4","mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("fileType is  -> ",fileType);

         // todo : add a upper limit og 5MB for video
        if(!isSupportedVdoFileType(fileType,supportedVdoFileType)){
            res.json({
                success:false,
                message:"File formate not supported",
            })
        }

        // file formate supported
        console.log("uploading to cloudinary");
        const response = await uploadVdoFileToCloudinary(file,"CloudVdo");
        console.log("response is ->",response);

        //save entry in db
        const filedatas = await File.create({
            name,
            tags,
            email,
            videoUrl:response.secure_url,
        })

        res.json({
            success:true,
            videoUrl:response.secure_url,
            message:`video uploaded successfully...!!`,
        })


    }catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:`somthing went wrong while uploading videos.`,
        })

    }
}


function isSupportedFileType(type,fileType){
        return fileType.includes(type);
}

async function uploadReducedImg(file,folder,quality){
    const option = {folder}
    console.log("temp file path : ",file.tempFilePath);

    if(quality){
        option.quality = quality;
    }

    option.resource_type = 'auto';
   return await cloudinary.uploader.upload(file.tempFilePath, option);
}

// imageReducerUpload handler

exports.imageReducerUpload = async(req,res) =>{
    try{
        const{name, tags, email} = req.body;
        console.log("fetched data : ", name, tags, email);

        const file = req.files.reducedImg;
        console.log("file : ", file);

        // validation
        const supportedFileType = ["png", "jpeg" ,"jpg"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("fileType :", fileType);

       if(!isSupportedFileType(fileType, supportedFileType)){
              res.status(400).json({
                success:false,
                message:`File formate is not supported`,
              })
       }

       // file formate supported

       const response = await uploadReducedImg(file,"reducedImg", 30);
       console.log("response : ", response);


    //    save in entry
       const fileData = await File.create({
        name,
        tags,
        email,
        imageUrl : response.secure_url,
       })
    

    res.json({
        success:true,
        imageUrl : response.secure_url,
        message:`Reduced Image successfully Uploaded`,

    })

    }catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:`somthing went wrong while uploading reducerImage.`,
        })
    }
}