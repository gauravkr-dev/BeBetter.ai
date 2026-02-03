import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
    createSession,
    startSession,
    endSession,
} from "./service";
import { getAgentReply } from "@/lib/interview-brain";
import { db } from "@/db";
import { interviewSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { inngest } from "@/inngest/client";

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

    // end: protectedProcedure
    //     .input(z.object({ sessionId: z.string() }))
    //     .mutation(({ input }) => {
    //         return endSession(input.sessionId);
    //     }),

    end: protectedProcedure
        .input(z.object({ sessionId: z.string() }))
        .mutation(async ({ input, ctx }) => {

            // 1️⃣ session end
            await endSession(input.sessionId);

            // 2️⃣ 🔥 INNGEST EVENT EMIT
            await inngest.send({
                name: "session.completed",
                data: {
                    sessionId: input.sessionId,
                    userId: ctx.auth.user.id,
                },
            });

            return { success: true };
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
