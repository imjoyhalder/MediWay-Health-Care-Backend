/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response, Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router()

router.post("/",
    // , checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single('file'),
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
    SpecialtyController.createSpecialty)
router.get("/",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
    SpecialtyController.getAllSpecialty)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty)
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.updateSpecialty)

export const SpecialtyRoutes = router
