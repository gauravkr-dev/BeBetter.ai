import { db } from '@/db';
import { userUsage } from '@/db/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import { eq } from 'drizzle-orm';
import { MAX_FREE_AGENTS, MAX_FREE_CHATS, MAX_FREE_MOCK_TESTS, MAX_FREE_RESUME_FEEDBACKS } from '@/modules/premium/constant';
export const createTRPCContext = cache(async () => {
    /**
     * @see: https://trpc.io/docs/server/context
     */
    return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User is not authenticated' });
    }
    return next({ ctx: { ...ctx, auth: session } });
})

export const premiumProcedure = (entity: 'interview' | 'chat' | 'mockTest' | 'resumeFeedback') => protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
    })
    const [usage] = await db
        .select()
        .from(userUsage)
        .where(eq(userUsage.userId, ctx.auth.user.id));
    const isPremium = customer.activeSubscriptions.length > 0;
    const isFreeAgentLimitReached = usage?.agentsCreated >= MAX_FREE_AGENTS;
    const isFreeChatLimitReached = usage?.chatsCreated >= MAX_FREE_CHATS;
    const isFreeMockTestLimitReached = usage?.mockTestCreated >= MAX_FREE_MOCK_TESTS;
    const isFreeResumeFeedbackLimitReached = usage?.resumeFeedbackReceived >= MAX_FREE_RESUME_FEEDBACKS;

    const shouldThrowAgentsError = entity === 'interview' && !isPremium && isFreeAgentLimitReached;
    const shouldThrowChatError = entity === 'chat' && !isPremium && isFreeChatLimitReached;
    const shouldThrowMockTestError = entity === 'mockTest' && !isPremium && isFreeMockTestLimitReached;
    const shouldThrowResumeFeedbackError = entity === 'resumeFeedback' && !isPremium && isFreeResumeFeedbackLimitReached;

    if (shouldThrowAgentsError || shouldThrowChatError || shouldThrowMockTestError || shouldThrowResumeFeedbackError) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: `Free ${entity} limit reached. Please upgrade to premium to continue using this feature.`,
        });
    }
    return next({ ctx: { ...ctx, customer } });
})