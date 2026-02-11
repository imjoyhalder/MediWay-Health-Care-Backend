// import { prisma } from '../../lib/prisma';
import { auth } from './../../lib/auth';


interface IRegisterPatientPayload {
    name: string;
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

export const AuthService = {
    registerPatient
}