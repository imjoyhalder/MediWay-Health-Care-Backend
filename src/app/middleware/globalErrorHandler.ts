/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import * as z from 'zod'
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = async(error: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.NODE_ENV === 'development') {
        console.error('Error From Global Error Handler:', error);
    }

    if (req.file) {
        await deleteFileFromCloudinary(req.file.path)
    }

    if(req.files && Array.isArray(req.files) && req.files.length > 0){
        const imageUrls = req.files.map((file)=>file.path); 
        await Promise.all(imageUrls.map(async (url)=> deleteFileFromCloudinary(url)))
    }

    let errorSource: TErrorSource[] = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR
    let message: string = 'Internal Server Error';
    let stack: string | undefined = undefined

    if (error instanceof z.ZodError) {

        const simplifiedError = handleZodError(error)

        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSource = [...simplifiedError.errorSource]
    }
    else if (error instanceof AppError) {
        statusCode = error.statusCode
        message = error.message
        stack = error.stack
        errorSource = [
            {
                path: '',
                message: error.message
            }
        ]
    }
    else if (error instanceof Error) {
        statusCode = status.INTERNAL_SERVER_ERROR
        message = error.message
        stack = error.stack
        errorSource = [
            {
                path: '',
                message: error.message
            }
        ]
    }

    const errorResponse: TErrorResponse = {

        success: false,
        statusCode,
        message: message,
        errorSource,
        error: envVars.NODE_ENV === 'development' ? error : undefined,
        stack: envVars.NODE_ENV === 'development' ? stack : undefined
    }

    res.status(statusCode).json(errorResponse);

}