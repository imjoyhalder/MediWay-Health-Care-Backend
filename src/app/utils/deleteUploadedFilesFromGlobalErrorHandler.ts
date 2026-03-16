import { Request } from "express";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";

export const deleteUploadedFilesFromGlobalErrorHandler = async (req: Request) => {
    try {

        const filesToDelete: string[] = [];

        if (req.file && req.file.path) {
            filesToDelete.push(req.file.path)
        }

        else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
            Object.values(req.files).forEach(fileArray => {
                if (Array.isArray(fileArray)) {
                    fileArray.forEach(file => {
                        if (file.path) {
                            filesToDelete.push(file.path)
                        }
                    })
                }
            })
        }
        else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.path) {
                    filesToDelete.push(file.path)
                }
            })
        }

        if (filesToDelete.length > 0) {
            await Promise.all(filesToDelete.map((file) => deleteFileFromCloudinary(file)));
            console.log(`Files ${filesToDelete.join(', ')} deleted from cloudinary`);
            console.log(`Files deleted ${filesToDelete.length} while handling error from cloudinary`);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("Error deleting uploaded file from global error handler:", error);
    }
}