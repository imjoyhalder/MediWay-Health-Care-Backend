
import { Router } from 'express'
import { checkAuth } from '../../middleware/checkAuth'
import { Role } from '../../../generated/prisma/enums'
import { validateRequest } from '../../middleware/validateRequest'
import { PatientValidation } from './patient.validation'
import { patientController } from './patient.controller'
import { multerUpload } from '../../../config/multer.config'
import { updateMyProfileMiddleWare } from './patient.middleware'

const router = Router()

router.patch('/update-my-profile',
    checkAuth(Role.PATIENT),
    multerUpload.fields([
        { name: "profilePhoto", maxCount: 1 },
        { name: "medicalReport", maxCount: 5 }
    ]),
    updateMyProfileMiddleWare,
    validateRequest(PatientValidation.updatePatientProfileZodSchema),
    patientController.updateMyProfile
)