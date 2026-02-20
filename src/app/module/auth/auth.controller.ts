
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import AppError from "../../errorHelpers/AppError";
import { cookieUtils } from "../../utils/cookie";



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
            message: "User registered successfully",
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
            message: "User logged in successfully",
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

        const { accessToken, refreshToken, token } = result

        tokenUtils.setAccessTokenCookie(res, accessToken)
        tokenUtils.setRefreshTokenCookie(res, refreshToken)
        tokenUtils.setBetterAuthCookie(res, token as string)

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Password changed successfully",
            data: result
        })

    }
)

const logoutUser = catchAsync(async (req: Request, res: Response) => {
    const betterAuthSession = req.cookies['better-auth.session_token']
    const result = await AuthService.logoutUser(betterAuthSession)

    cookieUtils.clearCookie(res, 'accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })

    cookieUtils.clearCookie(res, 'refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })

    cookieUtils.clearCookie(res, 'better-auth.session_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "User logged out successfully",
        data: result
    })
})

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

        if (!refreshToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! No refresh token provided")
        }

        const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken)

        const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

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

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    await AuthService.verifyEmail(email, otp)
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Email verified successfully"
    })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    await AuthService.forgetPassword(email)
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset OTP sent successfully"
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    await AuthService.resetPassword(email, otp, newPassword)
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Password reset successfully"
    })
})


const googleLogin = catchAsync(async (req: Request, res: Response) => {})

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {})

const handleOAuthError = catchAsync(async (req: Request, res: Response) => {})



export const AuthController = {
    registerPatient,
    loginPatient,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    verifyEmail, 
    forgetPassword,
    resetPassword, 
    googleLogin,
    googleLoginSuccess,
    handleOAuthError
}