import {apiError} from "../util/apiError.js";
import {asyncHandler} from "../util/asyncHandler.js";
import {users} from "../models/users.model.js";
import { uploadCloudinary } from "../util/cloudinary.js";
import {apiResponse} from "../util/apiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body //deconstructing an object, not forming another one
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new apiError(400, "All fields are required")
    }
    
    //for finding dups
    const existedUser = await users.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new apiError(409, "User with email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;

    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;

    if(!req.files.coverImage && !Array.isArray(req.files.coverImage) ){
        coverImageLocalPath="";
        console.log("entered");
    }
    else{
        coverImageLocalPath=req.files.coverImage[0].path;
    }
    if (!avatarLocalPath) {
         throw new apiError(400, "Avatar file is required") 
    }
    
    const avatarUpload = await uploadCloudinary(avatarLocalPath);
    const coverImageUpload = await uploadCloudinary(coverImageLocalPath);

    if (!avatarUpload) {
        throw new apiError(400, "Avatar file is required") 
    }

    const user = await users.create({
        fullName,
        avatar: avatarUpload.url,
        coverImage: coverImageUpload?.url || "",
        email, 
        password,
        username: username
    })
    //findOne returns actual user document from the db if found or null if not found
    const createdUser = await users.findOne(user._id).select( 
        "-passowrd -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res.status(200).json(
        new apiResponse(200,createdUser,"user successfully registered")
    )

});


export {registerUser};