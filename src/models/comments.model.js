import mongoose, {Schema} from "mongoose";

const commentsSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"videos"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"users"
    }
},{timestamps:true});

export const comments = mongoose.model("comments",commentsSchema);