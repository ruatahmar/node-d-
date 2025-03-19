import {apiError} from "../util/apiError.js";
import {asyncHandler} from "../util/asyncHandler.js";
import {users} from "../models/users.model.js";
import { uploadCloudinary } from "../util/cloudinary.js";
import {apiResponse} from "../util/apiResponse.js";
import jwt from "jsonwebtoken";

const generateTokens = asyncHandler(async(userId) => {
    try {
        const user = await users.findById(userId);
        if(!user){
            throw new apiError("400","Cant find user when trying to generate token");
        }
        
        const accessToken =user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false}) //because were not updating stuff like password or email that needs validation
        return {accessToken,refreshToken};
    } catch (error) {
        throw new apiError("400","Problem Generating Tokens")
    }
});

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

    let coverImageLocalPath = req.files?.coverImage?.[0]?.path || "";
    
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
    const createdUser = await users.findById(user._id).select( 
        "-passowrd -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res.status(200).json(
        new apiResponse(200,createdUser,"user successfully registered")
    )

});

const loginUser = asyncHandler( async (req,res) => {
    //take email and password
    //check if email is in db
    //check if password is correct
    //access and refresh token given 
    const {email,password} = req.body;
    if(!email){
        throw new apiError("400","Trouble fetching email");
    }
    const user = await users.findOne({email});
    if(!user){
        throw new apiError("400","User not found");
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if(!checkPassword){
        throw new apiError("400","Incorrect Password Given");
    }

    const {accessToken, refreshToken} = await generateTokens(user._id);

    const loggedInUser = await users.findById(user._id).select(
        "-password -refreshToken"
    );
    
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(
            "200",
            {
                user:loggedInUser,
                accessToken,
                refreshToken
            },
            "logged in succesfully"
        ) 

    )


});

const loggedOut = asyncHandler( async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        })
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
    
});

const refreshAccessToken = asyncHandler( async(req,res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!refreshToken){
        throw new apiError("400","Refresh Token not received");
    }
    const receivedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    
    const user = users.findById(receivedToken._id);
    if(!user){
        throw new apiError("400","Invalid Refresh Token");
    }
    if(refreshToken!==user.refreshToken){
        throw new apiError("400","Old refresh token");
    }
    const options={
        httpOnly:true,
        secure:true
    }

    const {accessToken,newRefreshToken} = await generateTokens(user._id);
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(200,
            {accessToken, refreshToken: newRefreshToken},
            "Access token refreshed"
        )
    )

});

const changeCurrentPassword = asyncHandler( async(req,res) => {
    const {currentPassword, newPassword} = await req.body;
    const user = await users.findById(req.user._id);
    //you dont check user because theyll be logged in anyway 
    // if(!user){
    //     throw new apiError("400","User not found");
    // }
    const isPasswordCorrect = await user.checkPassword(currentPassword);
    
    if(!isPasswordCorrect){
        throw new apiError("400","Password is not correct");
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200)
    .json(
        new apiResponse(
            200,
            {},
            "Password updated"
        )
    )
});

const getCurrentUser = asyncHandler(async (req,res) => {
    return res.status(200)
    .json(
        new apiResponse(
            200,
            req.user,
            "current user successfully fetched"
        )
    )
});

const updateUserDetails = asyncHandler(async (req,res) => {
    const {username} = req.body;
    if(!username){
        throw new apiError("400","Username not given");
    }
    const user = await users.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                username
            }
        },
        {new:true}
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async (req,res) => {
    const avatarImage = req.file?.path;
    if(!avatarImage){
        throw new apiError("400","File not found");
    }
    
    const avatar = await uploadCloudinary(avatarImage);
    if(!avatar.url){
        throw new apiError("400","Trouble uploading to cloudinary");
    }
    const user = await users.findOneAndUpdate(
        req.user._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")
    
    return res.status(200)
    .json(
        new apiResponse(
            200,
            user,
            "Avatar image successfully uploaded"
        )
    )
});

const updateUserCoverImage = asyncHandler(async (req,res) => {
    const coverImagePath = req.file?.path;
    if(!coverImagePath){
        throw new apiError("400","Cover image file is missing");
    }

    const coverImage = await uploadCloudinary(coverImagePath);
    if(!coverImage.url){
        throw new apiError("400","Error occured uploading");
    }

    const user = await users.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(
        new apiResponse(
            200,
            user,
            "Cover Image Uploaded"
        )
    )
});

export {
    registerUser,
    loginUser, 
    loggedOut, 
    refreshAccessToken, 
    changeCurrentPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    updateUserCoverImage
};