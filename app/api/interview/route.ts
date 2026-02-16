// import { inngest } from "@/inngest/client";

import { db } from "@/db";
import { sessionTranscripts } from "@/db/schema";
import { getAgentReply } from "@/lib/interview-brain";
import { NextResponse } from "next/server";
import { eq, asc } from "drizzle-orm";

export async function POST(req: Request) {
    const {
        userInput,
        agentName,
        agentInstruction,
        userExperience,
        totalDuration,
        remainingTime,
        agentId,
    } = await req.json();

    // Calculate interview stage based on remaining time

    function getInterviewStage(totalMinutes: number, remainingMinutes: number) {
        const elapsed = totalMinutes - remainingMinutes;
        const progress = elapsed / totalMinutes; // 0 → 1

        if (progress < 0.3) return "early";
        if (progress < 0.7) return "mid";
        if (progress < 0.9) return "closing";
        return "final";
    }

    const transcripts = await db
        .select()
        .from(sessionTranscripts)
        .where(eq(sessionTranscripts.agentId, agentId))
        .orderBy(asc(sessionTranscripts.sequence));


    const previousMessages = transcripts.map(t => ({
        role: t.speaker as "user" | "assistant",
        content: t.text,
    }));


    // 🔥 AI CALL DIRECTLY
    const aiResponse = await getAgentReply({
        agentName: agentName || "Interviewer",
        userExperience: userExperience || "Intermediate",
        totalDuration: totalDuration || 30,
        interviewStage: getInterviewStage(totalDuration || 30, remainingTime || 30),
        agentInstruction: agentInstruction || "You are a professional interviewer who asks technical questions.",
        userText: userInput,
        previousMessages: previousMessages || [],
    });

    // 🔥 CLIENT KO RESPONSE
    return NextResponse.json({
        response: aiResponse,
    });
}
