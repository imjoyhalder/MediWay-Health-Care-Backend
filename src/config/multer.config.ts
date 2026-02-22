/* eslint-disable no-useless-escape */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: (req, file)=>{
        const originalName = file.originalname;
        const extension = originalName.split('.').pop()?.toLocaleLowerCase(); 
        const fileNameWithoutExt = originalName
            .split('.')
            .slice(0, -1)
            .join('.')
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, ''); 

            const uniqueName = Math.random().toString(36).substring(2)+'-'+Date.now()+'-'+fileNameWithoutExt;
            const folder = extension === 'pdf' ? 'pdfs' : 'images';

            return {
                folder: `mediway-healthcare/${folder}`,
                public_id: uniqueName, 
                resource_type: "auto", 
                
            }
    }
})

export const multerUpload = multer({storage});