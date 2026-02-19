import { createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { transcriptRouter } from '@/modules/transcript/server/procedures';
import { chatRouter } from '@/modules/chatbot/server/chat/procedures';
import { chatMessagesRouter } from '@/modules/chatbot/server/chat-messages/procedures';
import { resumeRouter } from '@/modules/resume/server/procedures';
import { mockTestInputRouter, mockTestOverallFeedbackRouter, mockTestQuestionsRouter, mockTestUserAnswerRouter } from '@/modules/mock-test/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedures';
export const appRouter = createTRPCRouter({
    agents: agentsRouter,
    transcript: transcriptRouter,
    chat: chatRouter,
    chatMessage: chatMessagesRouter,
    resume: resumeRouter,
    mockTest: mockTestInputRouter,
    mockTestQuestions: mockTestQuestionsRouter,
    mockTestUserAnswer: mockTestUserAnswerRouter,
    mockTestOverallFeedback: mockTestOverallFeedbackRouter,
    premium: premiumRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;