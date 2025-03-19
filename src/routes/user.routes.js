import { Router } from "express";
import {registerUser, loginUser, loggedOut, refreshAccessToken} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { checkJwt } from "../middleware/authUser.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(checkJwt,loggedOut);

userRouter.route("/refresh-token").post(refreshAccessToken);

export {userRouter};