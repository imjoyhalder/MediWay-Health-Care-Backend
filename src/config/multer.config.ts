import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: (req, file)=>{
        const orginalName = file.originalname;
        // const extesions = 
    }
})

export const multerUpload = multer({storage});