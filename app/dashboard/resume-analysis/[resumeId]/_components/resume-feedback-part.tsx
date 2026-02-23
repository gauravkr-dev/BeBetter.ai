"use client";
import { useTRPC } from "@/trpc/client";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from '@tanstack/react-query';
import React from "react";
import { MiddlePart } from "./middle-part";
import { LastPart } from "./last-part";
import { FirstPart } from "./first-part";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Loader from "@/components/Loader";


export const ResumeFeedbackPart = () => {
    const params = useParams();
    const { resumeId: id } = params;

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        trpc.resume.getById.queryOptions({ id: id as any }),
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
            <div className="flex items-center justify-between mb-10">
                <Button variant="outline" className="group cursor-pointer" onClick={() => window.history.back()}>
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </Button>
                <Button variant="outline" className="group cursor-pointer" onClick={() => window.open(data?.resumeUrl, "_blank")}>
                    Preview Resume
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
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
                        contact_info={data?.feedback?.sections?.contact_info ?? { score: 0, comment: "" }}
                        experience={data?.feedback?.sections?.experience ?? { score: 0, comment: "" }}
                        education={data?.feedback?.sections?.education ?? { score: 0, comment: "" }}
                        skills={data?.feedback?.sections?.skills ?? { score: 0, comment: "" }}
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