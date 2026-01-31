import z from "zod";

export const agentsInsertSchema = z.object({
    name: z.string().min(1).max(100, { message: "Name is required" }),
    instructions: z.string().min(1).max(1000, { message: "Instruction is required" }),
    experience: z.string().min(1).max(1000, { message: "Experience is required" }),
})