import z from "zod";

export const agentsInsertSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).max(100),
    instructions: z.string().min(1, { message: "Instruction is required" }).max(1000),
    experience: z.string().optional()
})