// // src/lib/llm.ts
// import OpenAI from "openai";

// if (!process.env.GEMINI_API_KEY) {
//     throw new Error("GEMINI_API_KEY is missing in env");
// }

// export const llm = new OpenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
// });

// interface GetAgentReplyParams {
//     agentInstruction: string;
//     userText: string;
// }

// export const getAgentReply = async ({ agentInstruction, userText }: GetAgentReplyParams) => {
//     const response = await llm.chat.completions.create({
//         model: "gemini-2.5-flash",
//         temperature: 0.7,
//         messages: [
//             {
//                 role: "system",
//                 content: agentInstruction,
//             },
//             {
//                 role: "user",
//                 content: userText,
//             },
//         ],
//     });

//     return response.choices[0]?.message?.content ?? "";
// }

// src/lib/llm.ts
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
    agentInstruction: string;
    userText: string;
}

export const getAgentReply = async ({
    agentInstruction,
    userText,
}: GetAgentReplyParams) => {
    const response = await InterviewBrain.chat.completions.create({
        model: "arcee-ai/trinity-large-preview:free", // ✅ free + fast
        temperature: 0.7,
        messages: [
            {
                role: "system",
                content: agentInstruction,
            },
            {
                role: "user",
                content: userText,
            },
        ],
    });

    return response.choices[0]?.message?.content ?? "";
};
