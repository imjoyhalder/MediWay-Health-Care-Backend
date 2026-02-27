import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN))