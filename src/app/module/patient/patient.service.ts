import { IRequestUser } from "../../interfaces/requestUser.interface";
import { IUpdatePatientProfilePayload } from './patient.interface';
import { prisma } from '../../lib/prisma';


const updateMyProfile = async (user: IRequestUser, payload: IUpdatePatientProfilePayload) => {

    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        },
        include: {
            patientHealthData: true,
            medicalReports: true
        }
    });

    const result = await prisma.$transaction(async (tx) => {
        if (payload.patientInfo) {
            await tx.patient.update({
                where: {
                    id: patientData.id
                },
                data: {
                    ...payload.patientInfo
                }
            })

            if (payload.patientInfo.name || payload.patientInfo.profilePhoto) {

                const userData = {
                    name: payload.patientInfo.name ? payload.patientInfo.name : patientData.name,
                    image: payload.patientInfo.profilePhoto ? payload.patientInfo.profilePhoto : patientData.profilePhoto
                }

                await tx.user.update({
                    where: {
                        id: patientData.userId
                    },
                    data: {
                        ...userData
                    }
                })
            }
        }
    })
}