"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/optics/card";
import Image from "next/image";
import { useState } from "react";
import { GenerateQuiesDialog } from "./generate-quies-dialog";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MAX_FREE_MOCK_TESTS } from "@/modules/premium/constant";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const GenerateQuiesHeader = () => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const trpc = useTRPC();
    const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());
    if (!data) {
        return null;
    };
    const limitReached = data?.mockTestCreated >= MAX_FREE_MOCK_TESTS;

    return (
        <>
            <GenerateQuiesDialog open={isOpenDialog} onOpenChange={setIsOpenDialog} />
            <div className="flex flex-row items-center justify-center gap-8 mt-4 px-4 md:px-12">
                <Card
                    className="w-full flex flex-row items-center justify-center dark:bg-[#121212] px-4 py-6"
                    decorations
                >
                    <CardHeader className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-3">
                        <CardTitle className="text-2xl font-medium font-serif">
                            AI-Powered Mock Test for Targeted Exam Preparation
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Create intelligent, topic-based mock tests in seconds using advanced AI. Practice with customized questions, challenge your understanding, and track your preparation level effectively.
                        </CardDescription>

                        <Button className="w-32 bg-primary text-primary-foreground text-xs py-2 px-3 rounded hover:cursor-pointer hover:bg-primary/90" onClick={() => {
                            if (limitReached) {
                                toast.warning("Free limit reached. Please upgrade your plan.");
                                return;
                            }
                            setIsOpenDialog(true);
                        }}>
                            Give Test
                        </Button>


                    </CardHeader>

                    <CardHeader className="w-1/2 flex items-center justify-center hidden md:flex">
                        <Image src="/mock_test.svg" alt="Mock Test Header" width={250} height={100} />
                    </CardHeader>
                </Card>
            </div>
        </>
    )
}