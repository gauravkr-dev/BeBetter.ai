import { interviewRouter } from '@/modules/session/server/procedures';
import { createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { transcriptRouter } from '@/modules/transcript/server/procedures';
import { chatRouter } from '@/modules/chatbot/server/chat/procedures';
import { chatMessagesRouter } from '@/modules/chatbot/server/chat-messages/procedures';
import { resumeRouter } from '@/modules/resume/server/procedures';
import { mockTestInputRouter, mockTestQuestionsRouter } from '@/modules/mock-test/server/procedures';
export const appRouter = createTRPCRouter({
    agents: agentsRouter,
    interview: interviewRouter,
    transcript: transcriptRouter,
    chat: chatRouter,
    chatMessage: chatMessagesRouter,
    resume: resumeRouter,
    mockTestInput: mockTestInputRouter,
    mockTestQuestions: mockTestQuestionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;