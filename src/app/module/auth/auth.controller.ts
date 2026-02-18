import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";

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

export const AuthController = {
    registerPatient,
    loginPatient, 
    getMe
}