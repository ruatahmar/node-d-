import mongoose, {mongo, Schema} from "mongoose";

const userSchema = new Schema({
    watchHistory:[{
        type:Schema.type.ObjectId,
        ref:"videos"
    }],
    username:{
        type:String,
        required:true,
        unique:true,
        index:true, //index is important for entries you want to search
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    }
},{timestamps:ture});

export const users = mongoose.model("users",userSchema);