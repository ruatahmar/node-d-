import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema({
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        required:true
    },
    isPublished:{
        type:Boolean,
        required:true
    }
},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate)

export const videos = mongoose.model("videos",videoSchema);