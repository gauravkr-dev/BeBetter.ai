// import { inngest } from "@/inngest/client";
import { getChatbotReply } from "@/lib/chatbot-brain";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userInput } = await req.json();

    // 🔥 AI CALL DIRECTLY
    const aiResponse = await getChatbotReply({ userInput });

    // 🔥 CLIENT KO RESPONSE
    return NextResponse.json({
        response: aiResponse,
    });
}
