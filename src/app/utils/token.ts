import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";



const getAccessToken = (payload: JwtPayload) => {
    const accessToken = jwtUtils.createToken(
        payload,
        envVars.ACCESS_TOKEN_SECRET,
        { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions
    );

    return accessToken;
}

const getRefreshToken = (payload: JwtPayload) => {
    const refreshToken = jwtUtils.createToken(
        payload,
        envVars.REFRESH_TOKEN_SECRET,
        { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions
    );
    return refreshToken
}

const setAccessTokenCookie = (res: Response, accessToken: string) => {
    cookieUtils.setCookie(res, 'accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        //1 day, 
        maxAge: 60 * 60 * 24 * 1000
    })
}

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
    cookieUtils.setCookie(res, 'refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        //7 days 
        maxAge: 60 * 60 * 24 * 1000 * 7
    })
}

const setBetterAuthCookie = (res: Response, betterAuthToken: string) => {
    cookieUtils.setCookie(res, 'better-auth.session_token', betterAuthToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge:  60 * 60 * 24 * 1000
    })
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthCookie
}