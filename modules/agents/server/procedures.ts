import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import z from "zod";
import { and, count, desc, eq } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    update: protectedProcedure
        .input(agentsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const [updatedAgent] = await db
                .update(agents)
                .set(input)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id),
                    )
                )
                .returning();
            if (!updatedAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found or you do not have permission to update it.",
                });
            }
            return updatedAgent;
        }),
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [removeAgent] = await db
                .delete(agents)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id),
                    )
                )
                .returning();
            if (!removeAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found or you do not have permission to delete it.",
                });
            }
            return removeAgent;
        }),
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, input.id));
        return existingAgent;
    }),
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        }).optional())
        .query(async ({ input, ctx }) => {
            const data = await db
                .select()
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(input?.pageSize ?? DEFAULT_PAGE_SIZE)
                .offset(((input?.page ?? DEFAULT_PAGE) - 1) * (input?.pageSize ?? DEFAULT_PAGE_SIZE));

            const [total] = await db
                .select({ count: count() })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                    )
                );
            const totalPages = Math.ceil(Number(total.count) / (input?.pageSize ?? DEFAULT_PAGE_SIZE));


            return {
                items: data,
                total: Number(total.count),
                totalPages,
            }
        }),
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();
            return createdAgent;
        })
})