import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.get('/', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN), DoctorController.getAllDoctors)
router.get('/:id', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN), DoctorController.getDoctorById)
router.put('/:id', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN), validateRequest(updateDoctorZodSchema), DoctorController.updateDoctor)
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPPER_ADMIN), DoctorController.deleteDoctor)


export const DoctorRoutes = router