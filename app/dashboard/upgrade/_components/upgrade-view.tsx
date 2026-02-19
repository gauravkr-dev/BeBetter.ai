"use client"
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, RocketIcon } from "lucide-react";
import { PricingCard } from "./pricing-card";
import { authClient } from "@/lib/auth-client";

export const UpgradeView = () => {
    const trpc = useTRPC();
    const { data: products } = useSuspenseQuery(
        trpc.premium.getProducts.queryOptions()
    )

    const { data: currentSubscription } = useSuspenseQuery(
        trpc.premium.getCurrentSubscription.queryOptions()
    )

    return (
        <div className="mt-8 md:px-12 px-4">
            <Button variant="outline" className="group max-w-max mb-6">
                <RocketIcon className="" />
                You are currently on the {" "}
                <span className="font-bold text-blue-500">{currentSubscription?.name ?? "Free"}</span>{" "}
                Plan
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="mt-12 mb-12 grid md:grid-cols-2 gap-6">
                {products.map((product) => {
                    const isCurrentProduct = currentSubscription?.id === product.id;
                    const isPremium = !!currentSubscription;
                    let buttonText = "Upgrade";
                    let onClick = () => authClient.checkout({ products: [product.id] });

                    if (isCurrentProduct) {
                        buttonText = "Manage";
                        onClick = () => authClient.customer.portal();
                    } else if (isPremium) {
                        buttonText = "Change Plan";
                        onClick = () => authClient.customer.portal();
                    }

                    return (
                        <PricingCard
                            key={product.id}
                            price={
                                product.prices[0].amountType === "fixed" ? product.prices[0].priceAmount / 100 : 0
                            }
                            features={
                                product.benefits.map((benefit) => benefit.description)
                            }
                            title={product.name}
                            description={product.description}
                            priceSuffix={`${product.prices[0].recurringInterval}`}
                            buttonText={buttonText}
                            onClick={onClick}
                        />
                    )
                })}
            </div>
        </div>
    )
}