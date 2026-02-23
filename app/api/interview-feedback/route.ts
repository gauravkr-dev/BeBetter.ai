import { db } from "@/db";
import { sessionTranscripts } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { agentId, userId } = await req.json();

        if (!agentId) {
            return NextResponse.json(
                { error: "agentId is required" },
                { status: 400 }
            );
        }

        const transcripts = await db
            .select()
            .from(sessionTranscripts)
            .where(eq(sessionTranscripts.agentId, agentId))
            .orderBy(asc(sessionTranscripts.sequence));

        if (!transcripts.length) {
            return NextResponse.json(
                { error: "No transcripts found" },
                { status: 404 }
            );
        }

        const transcriptText = transcripts
            .map((t) => `${t.speaker === "agent" ? "Interviewer" : "Candidate"}: ${t.text}`)
            .join("\n");

        await inngest.send({
            name: "agent-interview-feedback",
            data: {
                interviewData: {
                    transcript: transcriptText,
                    agentId,
                    userId
                },
            },
        });


        return NextResponse.json({ status: "Feedback generation started" });
    } catch (error) {
        console.error("Interview Feedback Error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
