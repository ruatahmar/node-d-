import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    try{
        console.log(`${process.env.MONGO_URL}${DB_NAME}`);
        await mongoose.connect(`${process.env.MONGO_URL}${DB_NAME}`);
        console.log(`MONGODB CONNECTED. DB HOST:${mongoose.connection.host}`);//mongoose.connection is an object that contains connection info
    }
    catch(err){
        console.log("DATABASE CONNECTION FAILED:",err);
        process.exit(1);
    }


};

export default connectDb;