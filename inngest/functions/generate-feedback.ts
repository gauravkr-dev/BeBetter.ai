
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
                    content: `You are an experienced interview evaluator and career coach.

You are given the full transcript of an interview session — and
ASSUME the interview is COMPLETED and OVER.

Do NOT continue the interview.
Do NOT ask questions.
Do NOT act as interviewer.
Do NOT repeat transcript content.

Your only task is to ANALYZE the interview and generate feedback
based solely on what was said.

You should produce a single, coherent, human-friendly feedback
text that covers the following:

• Overall interview assessment
• Key strengths demonstrated by the candidate
• Areas where improvement is needed
• Specific, practical suggestions for improvement
• A final summary that ties it all together

Your feedback should:
- Be written as one plain text paragraph or block (not JSON).
- Include plenty of specific observations from the transcript.
- Be professional, encouraging, and clear.
- Treat the given transcript as if it is the final, completed interview,
  even if it was short or abrupt.

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
