import status from "http-status";
import * as z from "zod";
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";
export const handleZodError = (error: z.ZodError): TErrorResponse => {
    const statusCode = status.BAD_REQUEST
    const message = "Zod Validation Error"
    const errorSource: TErrorSource[] = []

    error.issues.forEach((issue) => {
        errorSource.push({
            // path: issue.path.length > 1 ? issue.path.join('=>') : issue.path[0].toString(),
            path: issue.path.join(' '),
            message: issue.message,
        })
    })

    return {
        success: false, 
        statusCode,
        message,
        errorSource
    }
}