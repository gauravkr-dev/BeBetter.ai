import { db } from "@/db";
import { sessionTranscripts } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { asc, eq } from "drizzle-orm";
import z from "zod";

export const transcriptRouter = createTRPCRouter({
    add: protectedProcedure
        .input(
            z.object({
                agentId: z.string(),
                speaker: z.enum(["user", "agent"]),
                text: z.string().min(1),
                sequence: z.number().int(),
            })
        )
        .mutation(async ({ input }) => {
            await db.insert(sessionTranscripts).values({
                agentId: input.agentId,
                speaker: input.speaker,
                text: input.text,
                sequence: input.sequence,
            });

            return { success: true };
        }),
    getByAgent: protectedProcedure
        .input(
            z.object({
                agentId: z.string(),
            })
        )
        .query(async ({ input }) => {
            return await db
                .select()
                .from(sessionTranscripts)
                .where(eq(sessionTranscripts.agentId, input.agentId))
                .orderBy(asc(sessionTranscripts.sequence));
        }),

});