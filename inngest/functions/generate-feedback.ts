import { createAgent, gemini } from "@inngest/agent-kit"
import { inngest } from "../client"
export const GenerateInterviewFeedbackAgent = createAgent({
  name: "Generate Feedback",
  description: "Generates feedback for a candidate based on their interview performance.",
  system: `You are an advanced AI Interview Feedback Agent.

Your task is to evaluate a candidate's interview performance and return a detailed analysis in the following structured JSON schema format.

The schema must match the layout and structure of a visual UI that includes overall score, category scores, summary feedback, improvement tips, strengths, and weaknesses.

INPUT: I will provide an interview transcript.

GOAL: Output a JSON report as per the schema below. The report should reflect:

overall_score (0-100)

overall_feedback (short message e.g., "Excellent Performance", "Good but Needs Improvement")

summary_comment (1-2 sentence overall evaluation summary)

Category scores for:

Communication Skills
Technical Knowledge
Problem Solving
Confidence & Clarity

Each category should include:

score (as percentage)

Optional comment about that category

Tips for improvement (3-5 tips)

What's Good (1-3 strengths)

Needs Improvement (1-3 weaknesses)

Output JSON Schema:

{
  "overall_score": 82,

  "overall_feedback": "Good Performance with Room for Growth",

  "summary_comment": "You demonstrated solid technical understanding, but improving clarity and confidence would significantly enhance your overall performance.",

  "categories": {
    "communication_skills": {
      "score": 75,
      "comment": "Clear explanations, but answers could be more structured."
    },

    "technical_knowledge": {
      "score": 88,
      "comment": "Strong understanding of core concepts and tools."
    },

    "problem_solving": {
      "score": 80,
      "comment": "Good logical thinking, but solutions could be explained more step-by-step."
    },

    "confidence_clarity": {
      "score": 70,
      "comment": "Some hesitation observed during complex questions."
    }
  },

  "tips_for_improvement": [
    "Structure your answers using frameworks like STAR or step-by-step explanations.",
    "Practice explaining technical concepts in a simpler and clearer way.",
    "Maintain steady pace and avoid rushing through answers.",
    "Provide more real-world examples to strengthen your responses."
  ],

  "whats_good": [
    "Strong technical foundation.",
    "Logical thinking approach.",
    "Good engagement with interviewer questions."
  ],

  "needs_improvement": [
    "Confidence during difficult questions.",
    "More structured responses.",
    "Improve clarity and conciseness."
  ]
}
`,
  model: gemini({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY_FOR_CHATBOT!,
  })
})

export const GenerateFeedbackAgent = inngest.createFunction(
  { id: "interview-feedback" },
  { event: "agent-interview-feedback" },
  async ({ event }) => {
    const { interviewData } = event.data;
    const result = await GenerateInterviewFeedbackAgent.run(interviewData)
    return result;
  }
)