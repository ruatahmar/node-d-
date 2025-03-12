import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();

app.use(cors());
app.use(express.json());  //parser json file and put in the req.body 
app.use(express.urlencoded());  //url parser and also puts it in req.body 
app.use(express.static("'public"));
app.use(cookieParser());

//routes work
import { userRouter } from "./routes/user.routes.js";

app.use("/user",userRouter);

export default app;