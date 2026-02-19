/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response, Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import { env } from "node:process";
import { envVars } from "../../../config/env";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router()

router.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.createSpecialty)
router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR), SpecialtyController.getAllSpecialty)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.deleteSpecialty)
router.patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), SpecialtyController.updateSpecialty)

export const SpecialtyRoutes = router
