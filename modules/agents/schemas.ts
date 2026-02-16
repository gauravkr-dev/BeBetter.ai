import z from "zod";

export const agentsInsertSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).max(100),
    instructions: z.string().min(1, { message: "Instruction is required" }).max(1000),
    experience: z.string().optional(),
    durationMinutes: z.number().min(10, { message: "Duration must be at least 10 minutes" }).max(60, { message: "Duration cannot exceed 1 hour" }),
    isInterviewCompleted: z.boolean().optional(),
})

export const agentsUpdateSchema = agentsInsertSchema
    .partial()
    .extend({
        id: z.string().min(1, { message: "ID is required for update" }),
    });
