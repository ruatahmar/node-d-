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
        type:Schema.Types.ObjectID,
        ref:"videos"
    }],
    owner:{
        type:Schema.Types.ObjectID,
        ref:"user"
    }
},{timestamps:true});

export const playlist = mongoose.model("playlist",playlistSchema); 