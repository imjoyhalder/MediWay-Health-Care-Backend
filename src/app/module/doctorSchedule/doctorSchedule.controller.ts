import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { Request, Response } from "express";
import { ScheduleService } from "../schedule/schedule.service";

const createDoctorSchedule = catchAsync((req: Request, res: Response) => {
    const schedule =  ScheduleService.createDoctorSchedule();
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED, 
        message: "Schedule created successfully",
        data: schedule  
    })
});

const getMyDoctorSchedule = catchAsync((req: Request, res: Response) => {
    const { id } = req.params;
    const schedule =  ScheduleService.getMyDoctorSchedule(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedule fetched successfully",
        data: schedule  
    })
});

const getAllDoctorSchedules = catchAsync((req: Request, res: Response) => {
    const schedules =  ScheduleService.getAllDoctorSchedules();
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedules fetched successfully",
        data: schedules  
    })
});

const getDoctorScheduleById = catchAsync((req: Request, res: Response) => {
    const { id } = req.params;
    const schedule =  ScheduleService.getDoctorScheduleById(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedule fetched successfully",
        data: schedule  
    })
});

const updateMyDoctorSchedule = catchAsync((req: Request, res: Response) => {
    const { id } = req.params;
    const schedule =  ScheduleService.updateMyDoctorSchedule(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedule updated successfully",
        data: schedule  
    })
});

const deleteMyDoctorSchedule = catchAsync((req: Request, res: Response) => {
    const { id } = req.params;
    const schedule =  ScheduleService.deleteMyDoctorSchedule(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedule deleted successfully",
        data: schedule  
    })
});

export const DoctorScheduleController = {
    createDoctorSchedule,
    getMyDoctorSchedule,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule
}