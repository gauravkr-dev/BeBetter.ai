"use client";

import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export const TestQuestions = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: userData } = authClient.useSession();
    const userId = userData?.user?.id;

    const params = useParams();
    const { id } = params;
    const trpc = useTRPC();

    const { data: questions } = useSuspenseQuery(
        trpc.mockTestQuestions.getById.queryOptions({
            mockTestId: id as string,
        })
    );

    const current = questions[currentQuestion];

    const handleSubmit = async () => {
        setLoading(true);

        const formattedAnswers = Object.entries(answers).map(
            ([sequence, userAnswerIndex]) => ({
                sequence: Number(sequence),
                userAnswerIndex,
            })
        );

        await axios.post("/api/insert-mock-test-result", {
            mockTestId: id,
            answers: formattedAnswers,
            userId,
        });
        router.push(`/dashboard/mock-test-analysis/${id}`);
        setLoading(false);
        toast.success("Test Submitted Successfully");
    };

    return (
        <div>
            <Card key={current.sequence}>
                <CardHeader>
                    <CardTitle>
                        Question {currentQuestion + 1} of {questions.length}
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p className="text-lg font-medium">{current.question}</p>

                    <RadioGroup
                        value={answers[current.sequence]?.toString() ?? ""}
                        className="space-y-2 mt-6"
                        onValueChange={(value) =>
                            setAnswers((prev) => ({
                                ...prev,
                                [current.sequence]: Number(value),
                            }))
                        }
                    >
                        {current.options.map((option: string, index: number) => (
                            <div key={index} className="flex items-center space-x-3">
                                <RadioGroupItem
                                    value={index.toString()}
                                    id={`option-${current.sequence}-${index}`}
                                />
                                <Label htmlFor={`option-${current.sequence}-${index}`}>
                                    {option.replace(/`/g, "")}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                </CardContent>

                <CardFooter className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        onClick={() =>
                            setCurrentQuestion((prev) => Math.max(0, prev - 1))
                        }
                    >
                        <ArrowLeft className="size-4" />
                        Previous
                    </Button>

                    {currentQuestion === questions.length - 1 ? (
                        <Button
                            className="bg-blue-500 text-white"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                            <ArrowRight className="size-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentQuestion((prev) => prev + 1)}
                        >
                            Next
                            <ArrowRight className="size-4" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};
