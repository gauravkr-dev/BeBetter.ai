import { interviewRouter } from '@/modules/session/server/procedures';
import { createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { transcriptRouter } from '@/modules/transcript/server/procedures';
export const appRouter = createTRPCRouter({
    agents: agentsRouter,
    interview: interviewRouter,
    transcript: transcriptRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;