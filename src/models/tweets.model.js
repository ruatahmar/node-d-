import mongoose, {Schema} from "mongoose";

const tweetsSchema = new Schema({
    owner:{
        type:Schema.types.ObjectId,
        ref:"users"
    },
    content:{
        type:String,
        required:true
    }
    
},{timestamps:true});

export const tweets = mongoose.model("tweets",tweetsSchema);