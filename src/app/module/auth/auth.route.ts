import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router = Router();

router.post('/register', AuthController.registerPatient)
router.post('/login', AuthController.loginPatient)
router.get('/me', checkAuth(Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT), AuthController.getMe)
router.post('/refresh-token', AuthController.getNewToken)
router.post('/change-password', checkAuth(Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT), AuthController.changePassword)
router.post('/logout', checkAuth(Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN, Role.PATIENT), AuthController.logoutUser)
router.post('/verify-email', AuthController.verifyEmail)

export const AuthRoutes = router