import { db } from "@/db";
import { resumeFeedback } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq } from "drizzle-orm";
import z from "zod";

export const resumeRouter = createTRPCRouter({
    getMany: protectedProcedure
        .query(async ({ ctx }) => {
            const data = await db
                .select()
                .from(resumeFeedback)
                .where(
                    eq(resumeFeedback.userId, ctx.auth.user.id)
                )
                .orderBy(desc(resumeFeedback.createdAt));
            return data;
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