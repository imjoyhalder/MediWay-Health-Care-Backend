
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { PatientService } from "./patient.service";
import status from "http-status";
import { sendResponse } from "../../shared/sendResponse";


const updateMyProfile = catchAsync(async(req: Request, res: Response) => {
    
    const user = req.user as IRequestUser
    const payload = req.body

    const result = await PatientService.updateMyProfile(user, payload)
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: "Patient profile updated successfully",
        data: result
    })
})

export const  patientController = {
    updateMyProfile
}