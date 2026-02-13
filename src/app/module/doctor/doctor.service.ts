import { prisma } from "../../lib/prisma";
import { IUpdateDoctor } from "./doctor.interface";


const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {  
            user: true,
            specialties: {
                select: {
                    specialty: {
                        select: {
                            title: true,
                        },
                    },
                },
            },
        },
    });
    return doctors;
};

const getDoctorById = async (id: string) => {   
    const doctor = await prisma.doctor.findUnique({
        where: {
            id, 
        },
        include: {  
            user: true, 
            specialties: {
                select: {
                    specialty: {
                        select: {
                            title: true,
                        },
                    },
                },
            },
        },
    });
    return doctor;
}

const updateDoctor = async (id: string, updateData: IUpdateDoctor) => {
    const doctor = await prisma.doctor.update({
        where: {    
            id,
        },
        data: { 
            ...updateData,
        },
    });
    return doctor;
}

const deleteDoctor = async (id: string) => {
    const doctor = await prisma.doctor.update({
        where: {
            id, 
        },
        data: {
            isDeleted: true,    
            deletedAt: new Date(),
        },
    });
    return doctor;
}

export const DoctorService = {
    getAllDoctors, 
    getDoctorById, 
    updateDoctor,
    deleteDoctor
}