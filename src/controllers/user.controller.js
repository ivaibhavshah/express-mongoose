import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { uploadOnCloudinary } from "../services/cloudinary.js"

const registerUser = asyncHandler( async (req, res) => {
    const { fullName, username, email, password } = req.body;

    if ([fullName, email, username, password].some((field) => 
        field?.trim() === "" )){
            throw new ApiError(400, "All Fields are Required!")
        }
    const existedUser = await User.findOne({
        // Operator for mongo db are used with $
        $or:[{ username }, { email }] 
    })
    if (existedUser){
        throw new ApiError(409, "User with email or username already exists!")
    }
    console.log("existedUser", existedUser)
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath = req.files?.coverImage ? req.files?.coverImage[0]?.path : null;

    if (!avatarLocalPath){
        throw new ApiError(400, "Avatar Image is Required!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    let coverImage;
    if(coverImageLocalPath != null){
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    }
    else{
        coverImage = null
    }
    if(!avatar){
        throw new ApiError(400, "Avatar Image is Required!")
    }

    const user = await User.create({
        fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    console.log("createdUser", createdUser)
    const createdUser1 = await User.findById(user._id).select(
        "username"
    )
    console.log("createdUser1", createdUser1)

    if(!createdUser){
        throw new ApiError(500, "Failed to Create User!")
    }
    
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User Registered Successfully!")
    )    
})

export {
    registerUser
}