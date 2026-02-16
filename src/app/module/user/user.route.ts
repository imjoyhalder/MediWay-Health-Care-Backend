
import { UserController } from "./user.controller";
import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post('/create-doctor', validateRequest(createDoctorZodSchema), UserController.createDoctor)

// router.post('/create-admin', UserController.createDoctor)
// router.post('/create-super-admin', UserController.createDoctor)

export const UserRoutes = router