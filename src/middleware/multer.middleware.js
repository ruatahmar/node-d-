import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.resolve("public"));
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})
//multer function returns a middleware function which configures the file based on the storage engine and and saves it in the path given
const upload = multer({
    storage
});


export {upload}