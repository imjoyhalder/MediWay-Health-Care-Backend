
import * as z from "zod";
import { NextFunction, Request, Response } from "express";

export const validateRequest = (zodSchema: z.ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if(req.body.data){
            req.body = JSON.parse(req.body.data)            
        }

        const parseResult = zodSchema.safeParse(req.body)
        if (!parseResult.success) {
            next(parseResult.error)
        }
        console.log(parseResult);
        // sanitizing the data 
        req.body = parseResult.data
        console.log(req.body, "After zod validation");
        next();
    }
}