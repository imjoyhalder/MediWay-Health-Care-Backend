
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import AppError from "../../errorHelpers/AppError";


const registerPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body

        const result = await AuthService.registerPatient(payload)

        const { accessToken, refreshToken, token, ...rest } = result

        tokenUtils.setAccessTokenCookie(res, accessToken)
        tokenUtils.setRefreshTokenCookie(res, refreshToken)
        tokenUtils.setBetterAuthCookie(res, token as string)

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Patient registered successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest
            }
        })
    }
)

const loginPatient = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body
        const result = await AuthService.loginPatient(payload)

        const { accessToken, refreshToken, token, ...rest } = result

        tokenUtils.setAccessTokenCookie(res, accessToken)
        tokenUtils.setRefreshTokenCookie(res, refreshToken)
        tokenUtils.setBetterAuthCookie(res, token)

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Patient logged in successfully",
            data: {
                token,
                accessToken,
                refreshToken,
                ...rest
            }
        })
    }
)

const changePassword = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body
        const sessionToken = req.cookies['better-auth.session_token']
        const result = await AuthService.changePassword(payload, sessionToken)
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result
        })
    }
)

const getMe = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user
        const result = await AuthService.getMe(user as IRequestUser)
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Patient fetched successfully",
            data: result
        })
    }
)

const getNewToken = catchAsync(
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        const betterAuthSessionToken = req.cookies['better-auth.session_token']

        if(!refreshToken){
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No refresh token provided")
        }

        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken )

        const {accessToken, refreshToken: newRefreshToken, sessionToken } = result; 

        tokenUtils.setAccessTokenCookie(res, accessToken)
        tokenUtils.setRefreshTokenCookie(res, newRefreshToken)
        tokenUtils.setBetterAuthCookie(res, sessionToken)

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Token fetched successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken
            }
        })
    }
)


export const AuthController = {
    registerPatient,
    loginPatient, 
    getMe, 
    getNewToken, 
    changePassword
}