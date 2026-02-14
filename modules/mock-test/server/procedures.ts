import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { db } from "@/db";
import { mockTest, mockTestOverallResult, mockTestQuestions, mockTestUserAnswer } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, asc, count, desc, eq } from "drizzle-orm";
import z from "zod";

export const mockTestInputRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        }).optional())
        .query(async ({ ctx, input }) => {
            const data = await db
                .select()
                .from(mockTest)
                .where(
                    eq(mockTest.userId, ctx.auth.user.id)
                )
                .orderBy(desc(mockTest.createdAt))
                .limit(input?.pageSize ?? DEFAULT_PAGE_SIZE)
                .offset(((input?.page ?? DEFAULT_PAGE) - 1) * (input?.pageSize ?? DEFAULT_PAGE_SIZE));

            const [total] = await db
                .select({ count: count() })
                .from(mockTest)
                .where(
                    and(
                        eq(mockTest.userId, ctx.auth.user.id),
                    )
                );
            const totalPages = Math.ceil(Number(total.count) / (input?.pageSize ?? DEFAULT_PAGE_SIZE));


            return {
                items: data,
                total: Number(total.count),
                totalPages,
            }
        }),
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

export const mockTestUserAnswerRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(z.object({ mockTestId: z.string() }))
        .query(async ({ ctx, input }) => {
            const data = await db
                .select()
                .from(mockTestUserAnswer)
                .where(
                    and(
                        eq(mockTestUserAnswer.mockTestId, input.mockTestId),
                        eq(mockTestUserAnswer.userId, ctx.auth.user.id)
                    )
                )
                .orderBy(asc(mockTestUserAnswer.sequence));
            return data;
        }),
});

export const mockTestOverallFeedbackRouter = createTRPCRouter({
    getById: protectedProcedure
        .input(z.object({ mockTestId: z.string() }))
        .query(async ({ ctx, input }) => {
            const data = await db
                .select()
                .from(mockTestOverallResult)
                .where(
                    and(
                        eq(mockTestOverallResult.mockTestId, input.mockTestId),
                        eq(mockTestOverallResult.userId, ctx.auth.user.id)
                    )
                )
                .orderBy(asc(mockTestOverallResult.createdAt));
            return data;
        }),
});
