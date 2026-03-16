
export interface ICreateReviewPayload {
    appointmentId: string
    rating: number
    review: string
}

export interface IUpdateReviewPayload {
    rating: number
    review: string
}