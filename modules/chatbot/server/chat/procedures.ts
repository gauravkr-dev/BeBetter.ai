import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { chat } from "@/db/schema";
import z from "zod";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

export const chatRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                title: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.auth.user.id;

            const [newChat] = await db
                .insert(chat)
                .values({
                    userId,
                    title: input.title ?? null,
                })
                .returning();

            return newChat;
        }),

    list: protectedProcedure
        .query(async ({ ctx }) => {
            const data = await db
                .select()
                .from(chat)
                .where(
                    eq(chat.userId, ctx.auth.user.id)
                )
                .orderBy(desc(chat.createdAt));

            return data;
        }),
    getById: protectedProcedure
        .input(z.object({ chatId: z.string() }))
        .query(async ({ ctx, input }) => {
            const [chatData] = await db
                .select()
                .from(chat)
                .where(
                    and(
                        eq(chat.id, input.chatId),
                        eq(chat.userId, ctx.auth.user.id)
                    )
                )

            if (!chatData) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Chat not found or access denied",
                });
            }

            return chatData;
        }),
    delete: protectedProcedure
        .input(z.object({ chatId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.auth.user.id;

            await db
                .delete(chat)
                .where(
                    and(
                        eq(chat.id, input.chatId),
                        eq(chat.userId, userId)
                    )
                );

            return { success: true };
        }),
    update: protectedProcedure
        .input(z.object({ chatId: z.string(), title: z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.auth.user.id;

            const [updatedChat] = await db
                .update(chat)
                .set({ title: input.title ?? null })
                .where(
                    and(
                        eq(chat.id, input.chatId),
                        eq(chat.userId, userId)
                    )
                )
                .returning();

            if (!updatedChat) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Chat not found or access denied",
                });
            }

            return updatedChat;
        }),
});
