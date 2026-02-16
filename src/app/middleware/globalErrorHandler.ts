/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import * as z from 'zod'
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";




// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.NODE_ENV === 'development') {
        console.error('Error From Global Error Handler:', error);
    }

    let errorSource: TErrorSource[] = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR
    let message: string = 'Internal Server Error';

    /* [
    {
        expected: 'string',
        code: 'invalid_type',
        path: [ 'username' ],
        message: 'Invalid input: expected string'
    },
    {
        expected: 'number',
        code: 'invalid_type',
        path: [ 'xp' ],
        message: 'Invalid input: expected number'
    }
    ] */

    if (error instanceof z.ZodError) {

        const simplifiedError = handleZodError(error)

        statusCode = simplifiedError.statusCode  as number
        message = simplifiedError.message
        errorSource = [...simplifiedError.errorSource]
    }

    const errorResponse: TErrorResponse = {
        success: false,
        message: message,
        errorSource,
        error: envVars.NODE_ENV === 'development' ? error : undefined,
    }   

    res.status(statusCode).json(errorResponse);

}