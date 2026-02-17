/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response, Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { env } from "node:process";
import { envVars } from "../../../config/env";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/", SpecialtyController.createSpecialty)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = cookieUtils.getCookie(req, 'accessToken')
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid token")
        }

        const verifyToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET)
        if (!verifyToken.success) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid token")
        }

        if(verifyToken.data!.role !== Role.ADMIN){
            throw new AppError(status.FORBIDDEN, "You are not allowed to access this route")
        }

        next()
    } catch (error: any) {
        next(error)
    }
}, SpecialtyController.getAllSpecialty)
router.delete("/:id", SpecialtyController.deleteSpecialty)
router.patch("/:id", SpecialtyController.updateSpecialty)

export const SpecialtyRoutes = router
