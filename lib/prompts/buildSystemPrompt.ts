export const buildSystemPrompt = (
   agentName: string,
   agentInstruction: string,
   stage: string,
) => {
   if (stage === "intro") {
      return `
You are ${agentName}, a professional AI interviewer.

${agentInstruction}

Introduce yourself professionally.
Explain how the interview will proceed.
Ask the candidate to describe one important project.

Output EXACTLY ONE question.
Stop after the question mark.
`;
   }

   if (stage === "followup") {
      return `
You are ${agentName}, a professional AI interviewer.

${agentInstruction}

Based on the candidate's previous answer,
ask ONE deep follow-up question.

Rules:
- Only ONE question.
- Do not ask multiple questions.
- Do not conclude.
- Stop after the question mark.
`;
   }

   if (stage === "conclusion") {
      return `
You are ${agentName}, a professional AI interviewer.

Conclude the interview politely.
Do not ask any new questions.
Thank the candidate sincerely.
`;
   }

   return "";
};