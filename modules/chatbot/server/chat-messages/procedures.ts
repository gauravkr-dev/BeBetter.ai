import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { chatMessage, chat } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

export const chatMessagesRouter = createTRPCRouter({
    add: protectedProcedure
        .input(
            z.object({
                chatId: z.string(),
                speaker: z.enum(["user", "agent"]),
                text: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.auth.user.id;

            // 1️⃣ Security check: chat belongs to user or not
            const chatExists = await db
                .select()
                .from(chat)
                .where(and(
                    eq(chat.id, input.chatId),
                    eq(chat.userId, userId)
                ))
                .limit(1)
                .then(rows => rows[0]);

            if (!chatExists) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Chat not found or access denied",
                });
            }

            //Generate sequence number for the new message

            const [{ maxSeq }] = await db
                .select({
                    maxSeq: sql<number>`COALESCE(MAX(${chatMessage.sequence}), 0)`,
                })
                .from(chatMessage)
                .where(eq(chatMessage.chatId, input.chatId));

            const nextSequence = maxSeq + 1;

            // 2️⃣ Insert message
            const [message] = await db
                .insert(chatMessage)
                .values({
                    chatId: input.chatId,
                    speaker: input.speaker,
                    text: input.text,
                    sequence: nextSequence,
                })
                .returning();

            // 3️⃣ Update chat updatedAt (optional but recommended)
            await db
                .update(chat)
                .set({ updatedAt: new Date() })
                .where(eq(chat.id, input.chatId));

            return message;
        }),
    getByChatId: protectedProcedure
        .input(z.object({ chatId: z.string() }))
        .query(async ({ ctx, input }) => {
            const userId = ctx.auth.user.id;
            // 1️⃣ Security check: chat belongs to user or not
            const chatExists = await db
                .select()
                .from(chat)
                .where(and(
                    eq(chat.id, input.chatId),
                    eq(chat.userId, userId)
                ))
                .limit(1)
                .then(rows => rows[0]);

            if (!chatExists) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Chat not found or access denied",
                });
            }

            // 2️⃣ Fetch messages for the chat
            const messages = await db
                .select()
                .from(chatMessage)
                .where(
                    eq(chatMessage.chatId, input.chatId))
                .orderBy(chatMessage.sequence)
                .then(rows => rows);

            return messages;
        }),
});
