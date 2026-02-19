"use client"
import { MAX_FREE_AGENTS, MAX_FREE_CHATS, MAX_FREE_MOCK_TESTS, MAX_FREE_RESUME_FEEDBACKS } from "@/modules/premium/constant";
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, RocketIcon } from "lucide-react";
import { TrialProgress } from "./trial-progress";
import { Button } from "@/components/ui/button";

export const FreeTrials = () => {

    const trpc = useTRPC();
    const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());
    if (!data) {
        return null;
    }
    return (
        <div className="my-6 md:px-12 px-4">
            <Button variant="outline" className="group max-w-max mb-6">
                <RocketIcon className="" />
                Your Free Trial Progress
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="flex flex-wrap gap-6 mt-6">
                <TrialProgress usage={data.agentsCreated} total={MAX_FREE_AGENTS} title="Interviews" />
                <TrialProgress usage={data.mockTestCreated} total={MAX_FREE_MOCK_TESTS} title="Mock Tests" />
                <TrialProgress usage={data.resumeFeedbackReceived} total={MAX_FREE_RESUME_FEEDBACKS} title="Resume" />
                <TrialProgress usage={data.chatsCreated} total={MAX_FREE_CHATS} title="Chats" />
            </div>
        </div>
    )
}