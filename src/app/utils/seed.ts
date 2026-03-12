import { envVars } from "../../config/env";
import { Role } from "../../generated/prisma/enums"
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma"

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
            where: {
                role: Role.SUPER_ADMIN
            }
        })
        if (isSuperAdminExist) {
            console.log("Super Admin already exist");
            return;
        }

        const SuperAdmin = await auth.api.signUpEmail({
            body: {
                name: "Super Admin",
                email: envVars.SUPPER_ADMIN_EMAIL,
                password: envVars.SUPPER_ADMIN_PASSWORD,
                role: Role.SUPER_ADMIN,
                needPasswordChange: false,
                rememberMe: false
            }
        })

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: SuperAdmin.user.id
                },
                data: {
                    emailVerified: true
                }
            })

            await tx.admin.create({
                data: {
                    userId: SuperAdmin.user.id,
                    name: "Super Admin",
                    email: envVars.SUPPER_ADMIN_EMAIL,

                }
            })
        })

        const superAdmin = await prisma.admin.findUnique({
            where: {
                email: envVars.SUPPER_ADMIN_EMAIL
            }
        })
        console.log("Super Admin Create", superAdmin);
    } catch (error) {
        console.log("Something went wrong while creating Super Admin", error);
        await prisma.user.delete(
            {
                where:
                {
                    email: envVars.SUPPER_ADMIN_EMAIL

                }
            })
    }
}