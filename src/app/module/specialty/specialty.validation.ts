import  z  from "zod";

const createSpecialtyZodSchema = z.object({
    title: z.string("title is required"),
    description: z.string().optional()
})

export const SpecialtyValidation = {
    createSpecialtyZodSchema
}