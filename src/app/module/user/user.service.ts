
import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctor } from "./user.interface";



/**
 * model Doctor {
    id String @id @default(uuid())

    name          String
    email         String    @unique
    profilePhoto  String?
    contactNumber String?
    address       String?
    isDeleted     Boolean   @default(false)
    deletedAt     DateTime?

    registrationNumber  String  @unique
    experience          Int     @default(0)
    gender              Gender
    appointmentFee      Float
    qualification       String
    currentWorkingPlace String?
    designation         String
    averageRating       Float   @default(0.0)

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    // Relations
    userId String @unique
    user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
    specialties DoctorSpecialty[]


    @@index([email], name: "idx_doctor_email")
    @@index([isDeleted], name: "idx_doctor_isDeleted")
    @@map("doctor")
}
 */



const createDoctor = async (payload: ICreateDoctor) => {
    const specialties: Specialty[] = []

    for (const specialtyId of payload.specialties) {
        const specialty = await prisma.specialty.findUnique({
            where: {
                id: specialtyId
            }
        })

        if (!specialty) {
            throw new AppError(status.NOT_FOUND,`Specialty with id ${specialtyId} not found`)
        }
        specialties.push(specialty)
    }

    const userExists = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    })
    if (userExists) {
        throw new AppError(status.CONFLICT,"User with this email already exists")
    }

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            name: payload.doctor.name,
            role: Role.DOCTOR,
            needPasswordChange: true
        }
    })


    try {
        const result = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor,
                },
            });

            const doctorSpecialty = specialties.map((specialty) => {
                return {
                    doctorId: doctorData.id,
                    specialtyId: specialty.id,
                };
            });

            await tx.doctorSpecialty.createMany({
                data: doctorSpecialty,
            });

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    averageRating: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            image: true,
                            status: true,
                            emailVerified: true,
                            isDeleted: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    specialties: {
                        select: {
                            specialty: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
            });

            return doctor;
        });

        return result;
    } catch (error) {
        console.log(error);

        await prisma.user.delete({
            where: {
                id: userData.user.id,
            },
        });

        throw error;
    }



}
export const UserService = {
    createDoctor
}
