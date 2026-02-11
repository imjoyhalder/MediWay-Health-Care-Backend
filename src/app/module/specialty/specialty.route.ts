import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";

const router = Router()

router.post("/", SpecialtyController.createSpecialty)
router.get("/", SpecialtyController.createSpecialty)
router.delete("/:id", SpecialtyController.createSpecialty)

export const SpecialtyRoutes = router
