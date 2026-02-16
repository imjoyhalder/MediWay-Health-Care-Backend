import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";
import ms, { StringValue } from "ms";


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
    const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue)
    cookieUtils.setCookie(res, 'accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: Number(maxAge)
    })
}

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
    const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRES_IN as StringValue)
    cookieUtils.setCookie(res, 'refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: Number(maxAge)
    })
}

const setBetterAuthCookie = (res: Response, betterAuthToken: string) => {
    const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRES_IN as StringValue)
    cookieUtils.setCookie(res, 'better-auth.session_token', betterAuthToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: Number(maxAge)
    })
}

export const tokenUtils = {
    getAccessToken,
    getRefreshToken, 
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthCookie
}