import { status } from 'http-status';
import { UserStatus } from '../../../generated/prisma/enums';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';
import { auth } from './../../lib/auth';
import { tokenUtils } from '../../utils/token';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { jwtUtils } from '../../utils/jwt';
import { envVars } from '../../../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { IChangePasswordPayload, ILoginPatientPayload, IRegisterPatientPayload } from './auth.interface';
import { ISession } from '../../interfaces/session.interface';



const registerPatient = async (payload: IRegisterPatientPayload) => {

    const data = await auth.api.signUpEmail({
        body: {
            name: payload.name,
            email: payload.email,
            password: payload.password,
        }
    })

    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to register patient")
    }

    try {
        const patient = await prisma.$transaction(async (tx) => {
            const createdPatient = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email
                }
            })
            return createdPatient
        })
        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            email: data.user.email,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        })

        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            email: data.user.email,
            name: data.user.name,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        })
        return {
            accessToken,
            refreshToken,
            ...data,
            // token: data.token,
            patient: patient
        }
    } catch (error) {
        console.log(error);
        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
        throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to create patient profile")
    }
}

const loginPatient = async (payload: ILoginPatientPayload) => {
    const data = await auth.api.signInEmail({
        body: {
            email: payload.email,
            password: payload.password,
        }
    })
    if (data.user.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Your account has been blocked. Please contact support.")
    }

    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "Your account has been deleted.")
    }

    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Invalid email or password")
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        email: data.user.email,
        name: data.user.name,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        email: data.user.email,
        name: data.user.name,
        status: data.user.status,
        isDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })

    return {
        ...data,
        accessToken,
        refreshToken
    }
}

const getMe = async (user: IRequestUser) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: user.userId
        },
        include: {
            patient: {
                include: {
                    appointments: true,
                    prescriptions: true,
                    medicalReports: true,
                    reviews: true,
                    patientHealthData: true
                }
            },
            doctor: {
                include: {
                    specialties: true,
                    appointments: true,
                    reviews: true,
                    prescriptions: true
                }
            },
            admin: true
        }
    })
    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found")
    }
    return isUserExist
}

const getNewToken = async (refreshToken: string, sessionToken: string) => {

    const isSessionTokenExist = await prisma.session.findUnique({
        where: {
            token: sessionToken,

        },
        include: {
            user: true
        }
    })

    if (!isSessionTokenExist) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token")
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)

    if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token")
    }

    const data = verifiedRefreshToken.data as JwtPayload

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        email: data.email,
        name: data.name,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    })

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        email: data.email,
        name: data.name,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    })

    const { token } = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date()
        }
    })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: token
    }
}

const changePassword = async (payload: IChangePasswordPayload, sessionToken: string) => {
    const session = await auth.api.getSession({
        headers: new Headers({
            "Authorization": `Bearer ${sessionToken}`
        })
    })

    if (!session) {
        throw new AppError(status.UNAUTHORIZED, "Invalid session token")
    }

    const { currentPassword, newPassword } = payload

    const result = await auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true
        },
        headers: new Headers({
            "Authorization": `Bearer ${sessionToken}`
        })
    })

    if(session.user.needPasswordChange){
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                needPasswordChange: false
            }
        })
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified
    })

    return {
        ...result,
        accessToken,
        refreshToken
    }
}

const logoutUser = async (sessionToken: string) => {
    const result = await auth.api.signOut({
        headers: new Headers({
            "Authorization": `Bearer ${sessionToken}`
        })
    })
    return result
}

const verifyEmail = async (email: string, otp: string) => {
    const result = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    })

    if (result.status && !result.user.emailVerified) {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                emailVerified: true
            }
        })
    }
}

const forgetPassword = async (email: string) => {
    const isExistUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isExistUser) {
        throw new AppError(status.NOT_FOUND, "User not found")
    }

    if (isExistUser.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Your account has been blocked. Please contact support.")
    }

    if (isExistUser.isDeleted || isExistUser.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "Your account has been deleted.")
    }

    if (!isExistUser?.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Please verify your email address first.")
    }

    await auth.api.requestPasswordResetEmailOTP({
        body: {
            email
        }
    })

}

const resetPassword = async (email: string, otp: string, newPassword: string) => {
    
    const isExistUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isExistUser) {
        throw new AppError(status.NOT_FOUND, "User not found")
    }

    if (isExistUser.status === UserStatus.BLOCKED) {
        throw new AppError(status.FORBIDDEN, "Your account has been blocked. Please contact support.")
    }

    if (isExistUser.isDeleted || isExistUser.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "Your account has been deleted.")
    }

    if (!isExistUser?.emailVerified) {
        throw new AppError(status.BAD_REQUEST, "Please verify your email address first.")
    }

    await auth.api.resetPasswordEmailOTP({
        body: {
            email, 
            otp: otp, 
            password: newPassword
        }
    })

    if(isExistUser.needPasswordChange){
        await prisma.user.update({
            where: {
                id: isExistUser.id
            },
            data: {
                needPasswordChange: false
            }
        })
    }

    await prisma.session.deleteMany({
        where: {
            userId: isExistUser.id
        }
    })
}

const googleLoginSuccess = async (session: ISession) => {
    const isPatientExist = await prisma.patient.findUnique({
        where: {
            userId: session.user.id
        }
    })
    if(!isPatientExist){
        await prisma.patient.create({
            data: {
                userId: session.user.id,
                name: session.user.name,
                email: session.user.email
            }
        })
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        email: session.user.email,
        name: session.user.name,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified
    })

    return {
        accessToken,
        refreshToken
    }
}



export const AuthService = {
    registerPatient,
    loginPatient,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    verifyEmail,
    forgetPassword,
    resetPassword, 
    googleLoginSuccess
}