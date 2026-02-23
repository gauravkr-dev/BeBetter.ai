// import { inngest } from "@/inngest/client";

import { db } from "@/db";
import { sessionTranscripts } from "@/db/schema";
import { getAgentReply } from "@/lib/interview-brain";
import { NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";

export async function POST(req: Request) {
    const {
        agentName,
        agentInstruction,
        agentId,
        followupCount,
    } = await req.json();


    const transcripts = await db
        .select()
        .from(sessionTranscripts)
        .where(eq(sessionTranscripts.agentId, agentId))
        .orderBy(asc(sessionTranscripts.sequence));


    const previousMessages = transcripts.map(t => ({
        role: t.speaker as "user" | "assistant",
        content: t.text,
    }));

    let stage: string;
    if (followupCount === 0) {
        stage = "intro";
    } else if (followupCount < 5) {
        stage = "followup";
    } else {
        stage = "conclusion";
    }
    // 🔥 AI CALL DIRECTLY
    const aiResponse = await getAgentReply({
        agentName: agentName || "Interviewer",
        agentInstruction: agentInstruction || "You are a professional interviewer who asks technical questions.",
        previousMessages: previousMessages || [],
        stage: stage,
    });

    // 🔥 CLIENT KO RESPONSE
    return NextResponse.json({
        response: aiResponse,
    });
}
