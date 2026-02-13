import { Request, Response } from "express"
import status from "http-status"

export const notFound = (req: Request, res: Response) => {
    res.status(status.NOT_FOUND).json({
        success: false,
        message: `Cannot find ${req.method} ${req.originalUrl} on this server`,
    })
}