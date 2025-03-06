import mongoose, {Schema} from "mongoose";

const likesSchema = new Schema({
    video:{
        types:Schema.types.ObjectID,
        ref: "videos"
    },
    comment:{
        types:Schema.types.ObjectID,
        ref:"comments"
    },
    likedBy:{
        types:Schema.types.ObjectID,
        ref:"users"
    },
    tweet:{
        types:Schema.types.ObjectID,
        ref:"tweets"
    }

},{timestamps:true});

export const likes = mongoose.model("like",likesSchema);