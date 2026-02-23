"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from '@tanstack/react-query';
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/Loader";
import { FirstPart } from "./first-part";
import { MiddlePart } from "./middle-part";
import { LastPart } from "./last-part";

interface InterviewFeedbackPartProps {
    agentId: string;
}
export const InterviewFeedbackPart = ({ agentId }: InterviewFeedbackPartProps) => {

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trpc.interviewFeedback.getById.queryOptions({ agentId: agentId as any }),
    )

    if (!data) {
        return (
            <div className='flex-1 flex items-center justify-center'>
                <Loader />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-10 px-4 md:px-6">
                <Button variant="outline" className="group cursor-pointer" onClick={() => window.history.back()}>
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Button>
            </div>
            {data?.feedback ? (
                <div>
                    <FirstPart
                        overall_score={data?.feedback?.overall_score ?? 0}
                        overall_feedback={data?.feedback?.overall_feedback ?? ""}
                        summary_comment={data?.feedback?.summary_comment ?? ""}
                    />
                    <MiddlePart
                        communication_skills={data?.feedback?.categories?.communication_skills ?? { score: 0, comment: "" }}
                        technical_knowledge={data?.feedback?.categories?.technical_knowledge ?? { score: 0, comment: "" }}
                        problem_solving={data?.feedback?.categories?.problem_solving ?? { score: 0, comment: "" }}
                        confidence_clarity={data?.feedback?.categories?.confidence_clarity ?? { score: 0, comment: "" }}
                    />
                    <LastPart
                        tips_for_improvement={data?.feedback?.tips_for_improvement ?? []}
                        whats_good={data?.feedback?.whats_good ?? []}
                        needs_improvement={data?.feedback?.needs_improvement ?? []}
                    />
                </div>
            ) : null}

        </div>
    )
}