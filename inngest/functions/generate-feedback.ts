
import { inngest } from "../client";
import { db } from "@/db";
import { sessionTranscripts, interviewFeedback } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { gemini } from "@/lib/gemini";

export const generateFeedback = inngest.createFunction(
    {
        id: "generate-interview-feedback",
    },
    { event: "session.completed" },
    async ({ event }) => {
        const { sessionId, userId } = event.data;

        // 1️⃣ Fetch transcripts (ORDERED)
        const transcripts = await db
            .select()
            .from(sessionTranscripts)
            .where(eq(sessionTranscripts.sessionId, sessionId))
            .orderBy(asc(sessionTranscripts.sequence));

        if (transcripts.length < 6) {
            await db.insert(interviewFeedback).values({
                sessionId,
                userId,
                overallFeedback: "Skipped feedback generation due to insufficient transcript data.",
            });

            return { skipped: true };
        }


        // 2️⃣ Format conversation for LLM
        const conversation = transcripts.map(t => ({
            role: t.speaker === "user" ? "user" : "assistant",
            content: t.text,
        })) as { role: "user" | "assistant"; content: string }[];

        // 3️⃣ Gemini prompt
        const response = await gemini.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "system",
                    content: `You are an expert interview evaluator.

You are given the complete content of one finished interview.
Assume the interview has ended and no more input will come.

Your task:
- Analyze the candidate’s technical ability, communication, clarity, and professionalism.
- Produce ONE SINGLE STRING as output.
- The output must be structured using clear section headings and bullet points.
- Do NOT return JSON.
- Do NOT use numbering.
- Use readable headings and hyphen-style bullet points.

Structure your response exactly like this:

Overall Summary:
<2–3 lines summary>

Strengths:
- ...
- ...

Weaknesses:
- ...
- ...

Communication & Clarity:
- ...

Suggestions for Improvement:
- ...

Final Verdict:
<1–2 lines honest assessment>

This entire response will be stored as a single text field called overallFeedback.


`,
                },
                ...conversation,
            ],
            temperature: 0.3,
        });

        // const raw = response.choices[0].message.content!;
        // const parsed = JSON.parse(raw);

        console.log("FULL AI RESPONSE 👉", JSON.stringify(response, null, 2));
        // 4️⃣ Save feedback

        const feedback =
            response.choices[0]?.message?.content?.trim() ||
            "The interview ended early. Feedback is based on limited interaction and may not fully reflect the candidate’s abilities.";
        await db.insert(interviewFeedback).values({
            sessionId,
            userId,
            overallFeedback: feedback,
        });

        return { success: true };
    }
);
