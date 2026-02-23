import { buildSystemPrompt } from "@/lib/prompts/buildSystemPrompt";

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
    agentInstruction: string;
    previousMessages?: {
        role: "user" | "assistant";
        content: string;
    }[];
}


export const getAgentReply = async ({
    agentName,
    agentInstruction,
    previousMessages,
}: GetAgentReplyParams) => {
    const systemPrompt = buildSystemPrompt(agentName, agentInstruction);
    const response = await InterviewBrain.chat.completions.create({
        model: "arcee-ai/trinity-large-preview:free", // ✅ free + fast
        temperature: 0.7,
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...(previousMessages ?? []),
        ],
    });

    return response.choices[0]?.message?.content ?? "";
};
