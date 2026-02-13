import OpenAI from "openai";

if (!process.env.GEMINI_API_KEY_FOR_CHATBOT && !process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY_FOR_CHATBOT or GEMINI_API_KEY is missing in env");
}

export const llm = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY_FOR_CHATBOT ?? process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

interface ResumeAnalyserParams {
    userInput: {
        question_count: string;
        describe_topics: string;
        questions_level: string;
    };
}

export const generateTechnicalInterviewQuestions = async ({ userInput }: ResumeAnalyserParams) => {
    const response = await llm.chat.completions.create({
        model: "gemini-2.5-flash",
        temperature: 0.7,
        messages: [
            {
                role: "system",
                content: `
You are an expert technical interviewer.

Generate exactly ${userInput.question_count} multiple-choice technical interview questions 
based on the topic: "${userInput.describe_topics}" 
and experience level: "${userInput.questions_level}".

Rules:
- Each question must have exactly 4 options.
- Only one option should be correct.
- Include a clear explanation for the correct answer.
- Do NOT include any extra text outside JSON.
- Return strictly valid JSON.

Required JSON format:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation_for_correctAnswer": "string"
    }
  ]
}
`,
            },
            {
                role: "user",
                content: JSON.stringify(userInput),
            },
        ],
    });

    return response.choices[0]?.message?.content ?? "";
}