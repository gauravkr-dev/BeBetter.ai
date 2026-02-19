"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/optics/card";
import Image from "next/image";
import { useState } from "react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MAX_FREE_AGENTS } from "@/modules/premium/constant";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export const InterviewHeader = () => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const trpc = useTRPC();
    const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());
    if (!data) {
        return null;
    };

    const limitReached = data?.agentsCreated >= MAX_FREE_AGENTS;
    return (
        <>
            <NewAgentDialog open={isOpenDialog} onOpenChange={setIsOpenDialog} />
            <div className="flex flex-row items-center justify-center gap-8 mt-4 px-4 md:px-12">
                <Card
                    className="w-full flex flex-row items-center justify-center dark:bg-[#121212] px-4 py-6"
                    decorations
                >
                    <CardHeader className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-4">
                        <CardTitle className="text-2xl font-medium font-serif">
                            Practice Interviews. Get Better. Get Hired.
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Create AI interviewers, practice real-world questions,
                            and get detailed feedback to improve your skills.
                        </CardDescription>

                        <Button
                            className="w-32 bg-primary text-primary-foreground text-sm py-2 px-3 rounded hover:cursor-pointer hover:bg-primary/90"
                            onClick={() => {
                                if (limitReached) {
                                    toast.warning("Free limit reached. Please upgrade your plan.");
                                    return;
                                }

                                setIsOpenDialog(true);
                            }}
                        >
                            Start Interview
                        </Button>
                    </CardHeader>

                    <CardHeader className="w-1/2 flex items-center justify-center hidden md:flex">
                        <Image src="/interview-header.svg" alt="Interview Header" width={200} height={100} />
                    </CardHeader>
                </Card>
            </div>
        </>
    )
}