
import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { DoctorController } from "../doctor/doctor.controller";


const router = Router()

router.post('/create-doctor-schedule',
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    DoctorController.createDoctorZodSchema
)