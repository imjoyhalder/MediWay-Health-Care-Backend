import * as z from "zod";


export const updateDoctorZodSchema = z.object({

    name: z.string("Name is required").min(3, 'Name must be at least 3 characters').max(50, 'Name must be at most 50 characters'),
    contactNumber: z.string("Contact number is required").min(11, 'Contact number must be  11 characters').max(14, 'Contact number must be at most 14 characters'),
    address: z.string("Address is required").min(3, 'Address must be at least 3 characters').max(100, 'Address must be at most 50 characters').optional(),
    experience: z.number("Experience is required").nonnegative('Experience can not be negative').optional(),
    appointmentFee: z.number("Appointment fee is required").nonnegative('Appointment fee can not be negative'),
    qualification: z.string("Qualification is required").min(3, 'Qualification must be at least 3 characters').max(100, 'Qualification must be at most 50 characters'),
    currentWorkingPlace: z.string(("Current working place must be string"))

}).partial(); 

