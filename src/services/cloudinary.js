// This function will be use to upload files from this server to cloudinary
import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";


// configuration of cloudinary api

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_ACCESS_SECRET_KEY
})


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath){
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath ,{resource_type:"auto"},);
        console.log("file uploaded on cloudinary", response.url)
        fs.unlinkSync(localFilePath);
        return response;
    }catch(e){
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadOnCloudinary}