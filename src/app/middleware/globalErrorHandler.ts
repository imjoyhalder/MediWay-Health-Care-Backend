/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    
    if(envVars.NODE_ENV === 'development') {
        console.error('Error From Global Error Handler:', error);
    }

    let statusCode: number =  status.INTERNAL_SERVER_ERROR
    let message: string = 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        error: error.message || 'An unexpected error occurred',
    });

}