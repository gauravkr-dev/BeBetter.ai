/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import {
    mockTestUserAnswer,
    mockTestQuestions,
} from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest) {
    try {

        const { mockTestId, answers, userId } = await req.json();

        if (!mockTestId || !answers || !userId) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // Fetch all questions for this test
        const questions = await db
            .select()
            .from(mockTestQuestions)
            .where(eq(mockTestQuestions.mockTestId, mockTestId));

        // Prepare rows to insert
        const rows = answers.map((answer: any) => {
            const question = questions.find(
                (q) => q.sequence === answer.sequence
            );

            const isCorrect =
                question?.correctAnswerIndex === answer.userAnswerIndex;

            return {
                mockTestId,
                userId,
                sequence: answer.sequence,
                userAnswerIndex: answer.userAnswerIndex,
                isCorrect: Boolean(isCorrect),
            };
        });

        console.log("Inserting rows:", rows);

        await db.insert(mockTestUserAnswer).values(rows);

        return NextResponse.json({
            success: true,
            message: "Answers saved successfully",
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
