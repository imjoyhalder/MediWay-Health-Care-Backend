import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createSchedule = catchAsync((req: Request, res: Response) => {
    const schedule =  ScheduleService.createSchedule();
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED, 
        message: "Schedule created successfully",
        data: schedule  
    })
});

const getAllSchedules = catchAsync((req: Request, res: Response) => {
    const schedules =  ScheduleService.getAllSchedules();
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedules fetched successfully",
        data: schedules  
    })
});

const getScheduleById = catchAsync((req: Request, res: Response) => {
    const { id } = req.params;
    const schedule =  ScheduleService.getScheduleById(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedule fetched successfully",
        data: schedule  
    })
});

const updateSchedule = catchAsync((req: Request, res: Response) => {
    const { id } = req.params;
    const schedule =  ScheduleService.updateSchedule(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedule updated successfully",
        data: schedule  
    })
});

const deleteSchedule = catchAsync((req: Request, res: Response) => {
    const { id } = req.params;
    const schedule =  ScheduleService.deleteSchedule(id);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK, 
        message: "Schedule deleted successfully",
        data: schedule  
    })
});

export const ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
}