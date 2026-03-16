import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { ReviewService } from "./review.service";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { ICreateReviewPayload } from "./review.interface";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";


const giveReview = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const payload = req.body;
    const result = await ReviewService.giveReview(user as IRequestUser, payload as ICreateReviewPayload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "Review given successfully",
        data: result,
    })
})

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewService.getAllReviews();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Reviews retrieved successfully",
        data: result,
    })
})

export const ReviewController = {
    giveReview,
    getAllReviews
}