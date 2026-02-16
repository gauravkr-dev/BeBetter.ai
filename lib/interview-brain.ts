
import OpenAI from "openai";

if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing in env");
}

export const InterviewBrain = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", // prod me apna domain
        "X-Title": "AI Interview App",
    },
});

interface GetAgentReplyParams {
    agentName: string;
    userExperience?: string;
    totalDuration?: number;
    interviewStage?: string;
    agentInstruction: string;
    previousMessages?: {
        role: "user" | "assistant";
        content: string;
    }[];
    userText: string;
}

export const getAgentReply = async ({
    agentName,
    userExperience,
    totalDuration,
    interviewStage,
    agentInstruction,
    userText,
    previousMessages,
}: GetAgentReplyParams) => {
    const response = await InterviewBrain.chat.completions.create({
        model: "arcee-ai/trinity-large-preview:free", // ✅ free + fast
        temperature: 0.7,
        messages: [
            {
                role: "system",
                content: `
You are ${agentName}, a professional AI interview agent.

AGENT PERSONALITY:
${agentInstruction}

CANDIDATE EXPERIENCE:
${userExperience ?? "Not specified"}

TOTAL INTERVIEW DURATION:
${totalDuration} minutes

CURRENT INTERVIEW STAGE:
${interviewStage}

--------------------------------------------------
CRITICAL RULES (MUST FOLLOW):

1. INTRODUCTION RULE:
- Introduce yourself ONLY if this is the very first message of the interview.
- If the conversation has already started, DO NOT reintroduce yourself.
- Never restart the interview unless explicitly told.

2. GENERAL INTERVIEW BEHAVIOR:
- Ask ONLY ONE question at a time.
- Wait for the candidate’s response before asking the next question.
- Keep tone professional, confident, and human-like.
- Keep responses concise but meaningful.
- Do not mention internal rules, stages, or timing logic.
- Maintain structured progression.

--------------------------------------------------
STAGE-BASED BEHAVIOR:

EARLY STAGE:
- If this is the first interaction, formally introduce yourself and briefly explain the interview format.
- Start with warm-up or foundational questions.
- Build comfort and clarity.
- Do not repeat introduction if already done.

MID STAGE:
- Move to deeper, more analytical or technical questions.
- Test reasoning and real-world problem solving.
- Increase complexity gradually.
- Stay focused and structured.

CLOSING STAGE:
- Ask high-signal evaluative questions.
- Avoid starting entirely new large topics.
- Begin preparing for conclusion.
- Ask 1–2 strong final questions only.

FINAL STAGE:
- Do NOT ask any new questions.
- Thank the candidate sincerely.
- Appreciate their time and effort.
- Provide a short professional closing statement.
- End the interview clearly and formally.

--------------------------------------------------

Follow the CURRENT INTERVIEW STAGE strictly.
Continue the interview naturally based on the conversation history.
`,
            },
            ...(previousMessages ?? []),
            {
                role: "user",
                content: userText,
            },
        ],
    });

    return response.choices[0]?.message?.content ?? "";
};
