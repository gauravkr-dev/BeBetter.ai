import { db } from "@/db";
import { mockTest, mockTestQuestions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, asc, desc, eq } from "drizzle-orm";
import z from "zod";

export const mockTestInputRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(z.object({ mockTestId: z.string() }))
        .query(async ({ ctx, input }) => {
            const [data] = await db
                .select()
                .from(mockTest)
                .where(
                    and(
                        eq(mockTest.id, input.mockTestId),
                        eq(mockTest.userId, ctx.auth.user.id)
                    )
                )
                .orderBy(desc(mockTest.createdAt));
            return data;
        }),
    delete: protectedProcedure
        .input(z.object({ mockTestId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await db
                .delete(mockTest)
                .where(
                    and(
                        eq(mockTest.id, input.mockTestId),
                        eq(mockTest.userId, ctx.auth.user.id)
                    )
                );
            return { success: true };
        }),
});

export const mockTestQuestionsRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(z.object({ mockTestId: z.string() }))
        .query(async ({ ctx, input }) => {
            const data = await db
                .select()
                .from(mockTestQuestions)
                .where(
                    and(
                        eq(mockTestQuestions.mockTestId, input.mockTestId),
                        eq(mockTestQuestions.userId, ctx.auth.user.id)
                    )
                )
                .orderBy(asc(mockTestQuestions.sequence));
            return data;
        }),
});

