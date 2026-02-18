/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { cookieUtils } from "../utils/cookie"
import AppError from "../errorHelpers/AppError"
import status from "http-status"
import { jwtUtils } from "../utils/jwt"
import { Role, UserStatus } from "../../generated/prisma/enums"
import { envVars } from "../../config/env"
import { prisma } from "../lib/prisma"


export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Session Token Verification
        const sessionToken = cookieUtils.getCookie(req, 'better-auth.session_token');

        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No Session token provided")
        }

        if (sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true
                }
            })
            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user

                const now = new Date();
                const expireAt = new Date(sessionExists.expiresAt)
                const createdAt = new Date(sessionExists.createdAt)

                const sessionLifeTime = expireAt.getTime() - createdAt.getTime()
                const timeRemaining = expireAt.getTime() - now.getTime()
                const percentRemaining = (timeRemaining / sessionLifeTime) * 100

                if (percentRemaining < 20) {
                    res.setHeader('X-Session-Remaining', 'true')
                    res.setHeader('X-Session-Expires-At', `${expireAt.toISOString()}`)
                    res.setHeader('X-Time-Remaining', timeRemaining.toString())

                    console.log("Session Expiring Soon!!");
                }

                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                    throw new AppError(status.UNAUTHORIZED, "Your account has been blocked or deleted")
                }

                if (user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, "Your account has been deleted")
                }

                if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, "You are not allowed to access this route")
                }

                req.user = {
                    userId: user.id,
                    role: user.role,
                    email: user.email,
                }
                // return next()
            }

            const accessToken = cookieUtils.getCookie(req, 'accessToken')
            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid token")
            }


        }


        // Access Token verification
        const accessToken = cookieUtils.getCookie(req, 'accessToken')
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid token")
        }

        const verifyToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET)
        if (!verifyToken.success) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid token")
        }

        if (authRoles.length > 0 && !authRoles.includes(verifyToken.data!.role)) {
            throw new AppError(status.FORBIDDEN, "You are not allowed to access this route")
        }

        next()
    } catch (error: any) {
        next(error)
    }
}