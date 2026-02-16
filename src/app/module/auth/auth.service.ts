import { status } from 'http-status';
// import { prisma } from '../../lib/prisma';
import { UserStatus } from '../../../generated/prisma/enums';
import AppError from '../../errorHelpers/AppError';
import { prisma } from '../../lib/prisma';
import { auth } from './../../lib/auth';
import { tokenUtils } from '../../utils/token';


interface IRegisterPatientPayload {
    name: string;
    email: string;
    password: string;
}

interface ILoginPatientPayload {
    email: string;
    password: string;
}

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
        return { ...data, patient: patient }
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

export const AuthService = {
    registerPatient,
    loginPatient
}