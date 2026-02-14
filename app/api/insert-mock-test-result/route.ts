/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import {
    mockTestUserAnswer,
    mockTestQuestions,
    mockTestOverallResult,
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

        let score = 0;
        const rows = answers.map((answer: any) => {
            const question = questions.find(
                (q) => q.sequence === answer.sequence
            );

            const isCorrect =
                question?.correctAnswerIndex === answer.userAnswerIndex;

            if (isCorrect) {
                score++;
            }
            return {
                mockTestId,
                userId,
                sequence: answer.sequence,
                userAnswerIndex: answer.userAnswerIndex,
                isCorrect: Boolean(isCorrect),
            };
        });

        await db.insert(mockTestUserAnswer).values(rows);

        const overall_score =
            questions.length > 0
                ? Math.round((score / questions.length) * 100)
                : 0;

        let overallFeedback = "";
        let summaryComment = "";

        if (overall_score >= 80) {
            overallFeedback = "Excellent performance!";
            summaryComment =
                "You have a strong grasp of the material. Keep up the great work!";
        } else if (overall_score >= 65) {
            overallFeedback = "Good job!";
            summaryComment =
                "You have a good understanding of the material, but there's still room for improvement. Review the questions and try again!";
        } else if (overall_score >= 50) {
            overallFeedback = "Good effort!";
            summaryComment =
                "You have a decent understanding of the material, but there's room for improvement. Review the questions and try again!";
        } else if (overall_score >= 35) {
            overallFeedback = "Needs Improvement!";
            summaryComment =
                "You struggled with this test. Review the material and try again.";
        } else {
            overallFeedback = "Poor performance!";
            summaryComment =
                "You had difficulty with this test. Consider reviewing the material thoroughly and seeking additional help if needed.";
        }


        await db.insert(mockTestOverallResult).values({
            mockTestId,
            userId,
            overall_score,
            overallFeedback,
            summaryComment

        })

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
