import mongoose, {Schema} from "mongoose";

const likesSchema = new Schema({
    video:{
        types:Schema.Types.ObjectID,
        ref: "videos"
    },
    comment:{
        types:Schema.Types.ObjectID,
        ref:"comments"
    },
    likedBy:{
        types:Schema.Types.ObjectID,
        ref:"users"
    },
    tweet:{
        types:Schema.Types.ObjectID,
        ref:"tweets"
    }

},{timestamps:true});

export const likes = mongoose.model("like",likesSchema);