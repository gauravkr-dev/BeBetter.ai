'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { BadgeCheck, BadgeX } from 'lucide-react';
import { useParams } from 'next/navigation';

export const LowerPart = () => {
    const params = useParams();
    const { id } = params;
    const trpc = useTRPC();
    const { data: questions } = useSuspenseQuery(
        trpc.mockTestQuestions.getById.queryOptions({
            mockTestId: id as string,
        })
    );

    const { data: userAnswers } = useSuspenseQuery(
        trpc.mockTestUserAnswer.getById.queryOptions({
            mockTestId: id as string,
        })
    );

    const mergedData = questions.map((q) => {
        const userAnswer = userAnswers.find(
            (ua) => ua.sequence === q.sequence
        );

        const userAnswerText =
            userAnswer !== undefined
                ? q.options[userAnswer.userAnswerIndex]
                : "Not Attempted";

        const correctAnswerText = q.options[q.correctAnswerIndex];

        return {
            sequence: q.sequence,
            question: q.question,
            userAnswerText,
            correctAnswerText,
            isCorrect: userAnswer?.isCorrect ?? false,
            explanation: q.explanation_for_correctAnswer,
        };
    });


    return (
        <section className="">
            <div className="px-4 md:px-6">
                <div className="mt-12">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
                    >
                        {mergedData.map((item) => (
                            <AccordionItem
                                key={item.sequence}
                                value={item.sequence.toString()}
                                className="border-dashed"
                            >
                                <AccordionTrigger className="hover:no-underline cursor-pointer">
                                    <div className="flex items-start gap-2 text-left">
                                        <span className="flex items-start gap-2">
                                            {item.sequence}. {item.question}

                                            {item.isCorrect ? (
                                                <BadgeCheck className="h-4 w-4 text-green-500 shrink-0 mt-1" />
                                            ) : (
                                                <BadgeX className="h-4 w-4 text-red-500 shrink-0 mt-1" />
                                            )}
                                        </span>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent>
                                    <div className="space-y-2 text-base">

                                        {item.isCorrect ? (
                                            <p className="border rounded-md p-3 bg-green-50 dark:bg-green-900/10">
                                                <span className="font-medium text-green-500 font-serif">Your Answer:</span> <span className='text-sm'>{item.userAnswerText.replace(/`/g, "")}</span>
                                            </p>
                                        ) : (
                                            <>
                                                <p className="border rounded-md p-3 bg-red-50 dark:bg-red-900/10">
                                                    <span className="font-medium text-red-500 font-serif">Your Answer:</span> <span className='text-sm'>{item.userAnswerText.replace(/`/g, "")}</span>
                                                </p>

                                                <p className="border rounded-md p-3 bg-green-50 dark:bg-green-900/10">
                                                    <span className="font-medium text-green-500 font-serif">Correct Answer:</span> <span className='text-sm'>{item.correctAnswerText.replace(/`/g, "")}</span>
                                                </p>
                                            </>
                                        )}

                                        <p className="border rounded-md p-3 bg-blue-50 dark:bg-blue-900/10">
                                            <span className="font-medium text-blue-500 font-serif">Explanation:</span> <span className='text-sm'>{item.explanation.replace(/`/g, "")}</span>
                                        </p>

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                </div>
            </div>
        </section>
    )
}