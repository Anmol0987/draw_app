import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email(),
    name: z.string().min(3).max(20),
    password: z.string().min(6).max(20),
})
export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
})
export const canvasSchema = z.object({
    Id: z.string(),
})
