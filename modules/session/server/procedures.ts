import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
    createSession,
    startSession,
    endSession,
} from "./service";
import { getAgentReply } from "@/lib/llm";
import { db } from "@/db";
import { interviewSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const interviewRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                agentId: z.string(),
                durationMinutes: z.number(),
            })
        )
        .mutation(({ input }) => {
            return createSession(input);
        }),

    start: protectedProcedure
        .input(z.object({ sessionId: z.string() }))
        .mutation(({ input }) => {
            return startSession(input.sessionId);
        }),

    end: protectedProcedure
        .input(z.object({ sessionId: z.string() }))
        .mutation(({ input }) => {
            return endSession(input.sessionId);
        }),

    agentReply: protectedProcedure
        .input(
            z.object({
                sessionId: z.string(),
                agentInstruction: z.string(),
                userText: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const agentText = await getAgentReply({
                agentInstruction: input.agentInstruction,
                userText: input.userText,
            });
            return { agentText };
        }),
    getOne: protectedProcedure
        .input(
            z.object({ id: z.string() })
        )
        .query(async ({ input }) => {
            const [session] = await db
                .select()
                .from(interviewSessions)
                .where(eq(interviewSessions.id, input.id));

            return session;
        }),
});
