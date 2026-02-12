import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { db } from "@/db";
import { resumeFeedback } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq } from "drizzle-orm";
import z from "zod";

export const resumeRouter = createTRPCRouter({
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        }).optional())
        .query(async ({ ctx, input }) => {
            const data = await db
                .select()
                .from(resumeFeedback)
                .where(
                    eq(resumeFeedback.userId, ctx.auth.user.id)
                )
                .orderBy(desc(resumeFeedback.createdAt))
                .limit(input?.pageSize ?? DEFAULT_PAGE_SIZE)
                .offset(((input?.page ?? DEFAULT_PAGE) - 1) * (input?.pageSize ?? DEFAULT_PAGE_SIZE));

            const [total] = await db
                .select({ count: count() })
                .from(resumeFeedback)
                .where(
                    and(
                        eq(resumeFeedback.userId, ctx.auth.user.id),
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
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const [data] = await db
                .select()
                .from(resumeFeedback)
                .where(
                    and(
                        eq(resumeFeedback.id, input.id),
                        eq(resumeFeedback.userId, ctx.auth.user.id)
                    )
                )
                .orderBy(desc(resumeFeedback.createdAt));
            return data;
        }),
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await db
                .delete(resumeFeedback)
                .where(
                    and(
                        eq(resumeFeedback.id, input.id),
                        eq(resumeFeedback.userId, ctx.auth.user.id)
                    )
                );
            return { success: true };
        }),
});