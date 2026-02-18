import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { GenerateFeedbackAgent } from "@/inngest/functions/generate-feedback";
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        GenerateFeedbackAgent,
    ],
});