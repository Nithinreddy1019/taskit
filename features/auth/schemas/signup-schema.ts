import * as z from "zod";


export const signUpSchema = z.object({
    username: z.string().min(1, {
        message: "Username is required"
    }),
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    })
})