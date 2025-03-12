import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadCloudinary = async function(localPathFile){
    try{
        if(!localPathFile) return null;
        const response = await cloudinary.uploader.upload(localPathFile,{
            resource_type:"auto"
        })
        console.log("sucessfully uploaded to cloudinary");
        fs.unlinkSync(localPathFile);
        return response
    }
    catch(err){
        console.log("Failed to upload to cloudinary:",err);
        fs.unlinkSync(localPathFile);
        return null;   
    }
}

export {uploadCloudinary};