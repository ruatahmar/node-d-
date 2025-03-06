import mongoose, {Schema} from "mongoose";

const commentsSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    video:{
        type:Schema.types.ObjectId,
        ref:"videos"
    },
    owner:{
        type:Schema.types.ObjectId,
        ref:"users"
    }
},{timestamps:true});

export const comments = mongoose.model("comments",commentsSchema);