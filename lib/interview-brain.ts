import { buildSystemPrompt } from "@/lib/prompts/buildSystemPrompt";
import { client } from "./openai";

if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is missing in env");
}

interface GetAgentReplyParams {
    agentName: string;
    agentInstruction: string;
    stage: string;
    previousMessages?: {
        role: "user" | "assistant";
        content: string;
    }[];
}


export const getAgentReply = async ({
    agentName,
    agentInstruction,
    stage,
    previousMessages,
}: GetAgentReplyParams) => {
    const systemPrompt = buildSystemPrompt(agentName, agentInstruction, stage);
    const response = await client.chat.completions.create({

        model:
            "llama-3.1-8b-instant",

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
