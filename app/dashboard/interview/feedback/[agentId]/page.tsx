"use client"

import React from "react";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const InterviewFeedbackPage = () => {
    const params = useParams() as { agentId?: string };
    const router = useRouter();
    const agentId = params?.agentId ?? "";
    const trpc = useTRPC();

    const { data } = useSuspenseQuery(
        trpc.interview.getFeedbackByAgent.queryOptions({ agentId }),
    );

    const session = data?.session;
    const feedback = data?.feedback;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">Back</Button>

            <h1 className="text-2xl font-semibold mb-2">Interview Feedback</h1>

            {session ? (
                <div className="mb-4">
                    <p className="text-sm text-muted-foreground">Agent ID: {session.agentId}</p>
                    <p className="text-sm text-muted-foreground">Session: {session.id}</p>
                    <p className="text-sm text-muted-foreground">Ended: {session.endedAt ? formatDistanceToNow(new Date(session.endedAt), { addSuffix: true }) : "-"}</p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground mb-4">No completed session found for this agent.</p>
            )}

            {feedback?.overallFeedback ? (
                <div className="prose dark:prose-invert bg-card p-4 rounded">
                    <h2 className="text-lg font-medium">Overall Feedback</h2>
                    <p className="whitespace-pre-wrap">{feedback.overallFeedback}</p>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">No feedback available for this session.</p>
            )}
        </div>
    );
};

export default InterviewFeedbackPage;
