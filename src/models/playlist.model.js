import mongoose, {Schema} from "mongoose;"

const playlistSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    //array because of the number of videos
    videos:[{
        type:Schema.types.ObjectID,
        ref:"videos"
    }],
    owner:{
        type:Schema.types.ObjectID,
        ref:"user"
    }
},{timestamps:true});

export const playlist = mongoose.model("playlist",playlistSchema); 