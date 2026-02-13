import { NextRequest, NextResponse } from "next/server";
import { generateTechnicalInterviewQuestions } from "@/lib/quies-generator-analysis";
import { db } from "@/db";
import { mockTest, mockTestQuestions } from "@/db/schema";

export async function POST(req: NextRequest) {
    try {
        const { userInput, id, userId } = await req.json();

        // Insert mock test data to database
        try {
            await db.insert(mockTest).values({
                id,
                userId,
                question_count: userInput.questionCount,
                describe_topics: userInput.describe_topics,
                questions_level: userInput.questions_level,
            })
        } catch (error) {
            console.error("Error inserting mock test data:", error);
        }

        // AI CALL DIRECTLY
        const aiResponse = await generateTechnicalInterviewQuestions({ userInput });

        const cleanedContent = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsedData = JSON.parse(cleanedContent);
        console.log("Parsed AI Response:", parsedData);

        // Insert questions into database
        try {
            for (let i = 0; i < parsedData.questions.length; i++) {
                const questionData = parsedData.questions[i];
                await db.insert(mockTestQuestions).values({
                    userId,
                    mockTestId: id,
                    sequence: i + 1,
                    question: questionData.question,
                    options: questionData.options,
                    correctAnswerIndex: questionData.options.findIndex((option: string) => option === questionData.correctAnswer),
                    explanation_for_correctAnswer: questionData.explanation_for_correctAnswer,
                });
            }
        } catch (error) {
            console.error("Error inserting mock test questions:", error);
        }

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error("Error generating questions:", error);
        return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }
}

