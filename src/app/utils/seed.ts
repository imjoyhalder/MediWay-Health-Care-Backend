import { Role } from "../../generated/prisma/enums"
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma"

export const seedSuperAdmin = async()=>{
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
        where: {
            role: Role.SUPER_ADMIN
        }
    })
    if(isSuperAdminExist){
        console.log("Super Admin already exist");
        return; 
    }

    const consSuperAdmin = await auth.api.signUpEmail({
        body: {
            name: "Super Admin",
            email: "super-admin@better-health",
            password: "password",
            role: Role.SUPER_ADMIN, 
            needPasswordChange: false, 
            rememberMe: false
        }
    })
    } catch (error) {
        console.log(error);
    }
}