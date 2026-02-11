// import { prisma } from '../../lib/prisma';
import { UserStatus } from '../../../generated/prisma/enums';
import { auth } from './../../lib/auth';


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
        throw new Error("Failed to register patient")
    }

    //     const patient = await prisma.$transaction(async(tx)=>{

    //     })
    return data
}

const loginPatient = async (payload: ILoginPatientPayload) => {
    const data = await auth.api.signInEmail({
        body: {
            email: payload.email,
            password: payload.password,
        }
    })
    if (data.user.status === UserStatus.BLOCKED) {
        throw new Error("Your account has been blocked. Please contact support.")
    }
    
    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new Error("Your account has been deleted.")
    }

    if (!data.user) {
        throw new Error("Invalid email or password")
    }
    return data
}

export const AuthService = {
    registerPatient,
    loginPatient
}