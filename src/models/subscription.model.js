import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.type.ObjectId,
        ref:"user"
    },
    channel:{
        type:Schema.type.ObjectId,
        ref:"user"
    }
},{timestamps:true});

export const subscription = mongoose.model("subscription",subscriptionSchema);