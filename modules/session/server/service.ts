import { db } from "@/db";
import { interviewSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createSession(data: {
    userId: string;
    agentId: string;
    durationMinutes: number;
}) {
    const [session] = await db
        .insert(interviewSessions)
        .values({
            ...data,
            status: "created",
        })
        .returning();

    return session;
}

export async function startSession(sessionId: string) {
    await db
        .update(interviewSessions)
        .set({
            status: "in_progress",
            startedAt: new Date(),
        })
        .where(eq(interviewSessions.id, sessionId));
}

export async function endSession(sessionId: string) {
    await db
        .update(interviewSessions)
        .set({
            status: "completed",
            endedAt: new Date(),
        })
        .where(eq(interviewSessions.id, sessionId));
}
