import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN))
router.get('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR))
router.get('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR))
router.patch('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN))
router.delete('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN))