import status from "http-status";
import { PaymentStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface"
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from './review.interface';


const giveReview = async (user: IRequestUser, payload: ICreateReviewPayload) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
        }
    })

    if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
        throw new AppError(status.BAD_REQUEST, "You can only give review after payment completed");
    }

    if (appointmentData.patientId !== patientData.id) {
        throw new AppError(status.BAD_REQUEST, "You can only give review on your own appointment");
    }

    const isReviewed = await prisma.review.findFirst({
        where: {
            appointmentId: payload.appointmentId,
            patientId: patientData.id
        }
    })

    if (isReviewed) {
        throw new AppError(status.BAD_REQUEST, "You have already given review for this appointment. You can update or delete your review.");
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.review.create({
            data: {
                ...payload,
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId,
            }
        })

        const averageRating = await tx.review.aggregate({
            where: {
                doctorId: appointmentData.doctorId
            },
            _avg: {
                rating: true
            }
        }) || { _avg: { rating: 0 } };


        await tx.doctor.update({
            where: {
                id: appointmentData.doctorId
            },
            data: {
                averageRating: averageRating._avg.rating as number
            }
        })
    })

    return result;
}

const getAllReviews = async () => {
    return true
}

const myReviews = async () => {
    return true
}

const updateReview = async () => {

}

const deleteReview = async () => {

}

export const ReviewService = {
    giveReview,
    getAllReviews,
    myReviews,
    updateReview,
    deleteReview
}