import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import * as z from "zod";
import { Gender } from "../../../generated/prisma/enums";
import app from "../../../app";
import { de } from "zod/locales";

const createDoctorZodSchema = z.object({
    password: z.string("Password is required").min(6, 'Password must be at least 6 characters').max(50, 'Password must be at most 50 characters'),
    doctor: z.object({
        name: z.string("Name is required").min(3, 'Name must be at least 3 characters').max(50, 'Name must be at most 50 characters'),
        email: z.email("Invalid email address"),
        contactNumber: z.string("Contact number is required").min(11, 'Contact number must be  11 characters').max(14, 'Contact number must be at most 14 characters'),
        address: z.string("Address is required").min(3, 'Address must be at least 3 characters').max(100, 'Address must be at most 50 characters').optional(),
        registrationNumber: z.string("Registration number is required"),
        experience: z.number("Experience is required").nonnegative('Experience can not be negative').optional(),
        gender: z.enum([Gender.FEMALE, Gender.MALE], 'Gender is must be MALE or FEMALE'),
        appointmentFee: z.number("Appointment fee is required").nonnegative('Appointment fee can not be negative'),
        qualification: z.string("Qualification is required").min(3, 'Qualification must be at least 3 characters').max(100, 'Qualification must be at most 50 characters'),
        currentWorkingPlace: z.string("Current working place is required").min(3, 'Current working place must be at least 3 characters').max(100, 'Current working place must be at most 50 characters'),
        designation: z.string("Designation is required").min(3, 'Designation must be at least 3 characters')
    }),
    specialties: z.array(z.uuid("Specialty is required").min(1, 'At least one specialty is required'))
})

const router = Router();

router.post('/create-doctor', (req: Request, res: Response, next: NextFunction) => {

    console.log(req.body,"Before Zod Validation" );

    const parseResult = createDoctorZodSchema.safeParse(req.body)
    if(!parseResult.success) {
        next(parseResult.error)
    }

    // sanitizing the data 
    req.body = parseResult.data 
    console.log(req.body , "After zod validation");
    next();

}, UserController.createDoctor)
// router.post('/create-admin', UserController.createDoctor)
// router.post('/create-super-admin', UserController.createDoctor)

export const UserRoutes = router