import { db } from "@/db";
import { userUsage } from "@/db/schema";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";

export const premiumRouter = createTRPCRouter({
    getCurrentSubscription: protectedProcedure
        .query(async ({ ctx }) => {
            const customer = await polarClient.customers.getStateExternal({
                externalId: ctx.auth.user.id,
            })
            const subscription = customer.activeSubscriptions[0];
            if (!subscription) {
                return null;
            }
            const product = await polarClient.products.get({
                id: subscription.productId,
            })
            return product;
        }),
    getProducts: protectedProcedure
        .query(async () => {
            const products = await polarClient.products.list({
                isArchived: false,
                isRecurring: true,
                sorting: ["price_amount"]
            })
            return products.result.items;
        }),
    getFreeUsage: protectedProcedure
        .query(async ({ ctx }) => {
            const customer = await polarClient.customers.getStateExternal({
                externalId: ctx.auth.user.id,
            })
            const subscription = customer.activeSubscriptions[0];

            if (subscription) {
                return null;
            }
            let [usage] = await db
                .select()
                .from(userUsage)
                .where(eq(userUsage.userId, ctx.auth.user.id));

            if (!usage) {
                const [newUsage] = await db
                    .insert(userUsage)
                    .values({
                        userId: ctx.auth.user.id,
                        agentsCreated: 0,
                        mockTestCreated: 0,
                        chatsCreated: 0,
                        resumeFeedbackReceived: 0,
                    })
                    .returning();

                usage = newUsage;
            }

            return {
                agentsCreated: usage.agentsCreated,
                mockTestCreated: usage.mockTestCreated,
                chatsCreated: usage.chatsCreated,
                resumeFeedbackReceived: usage.resumeFeedbackReceived,
            }
        }),
})