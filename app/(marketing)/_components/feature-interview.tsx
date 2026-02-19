"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeatureInterviewAI() {
    return (
        <section className="w-full py-18">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left Side - Content */}
                    <div className="space-y-6">

                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Practice Real Interviews With AI
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            Experience realistic interview simulations powered by intelligent AI agents.
                            Create your own interviewer by defining an agent name and custom instructions,
                            and let the AI conduct a structured interview tailored to your goals.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            Once the interview is complete, receive a detailed performance report including
                            strengths, weaknesses, communication quality, and actionable improvement insights —
                            just like a real interview feedback.
                        </p>

                        <ul className="space-y-4 pt-4">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Create custom AI interviewers with your own instructions
                                </p>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Simulate real-world interview scenarios and questions
                                </p>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Get detailed feedback on performance, confidence, and weaknesses
                                </p>
                            </li>
                        </ul>

                        {/* CTA */}
                        <div className="pt-6">
                            <Link href="/sign-up">
                                <Button className="group cursor-pointer" variant={"outline"}>
                                    Start AI Interview
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Image / Illustration */}
                    <div className="relative flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-2xl  flex items-center justify-center">
                            {/* Replace this image with your actual illustration */}
                            <Image
                                src="/interview-header.svg"
                                alt="AI Interview Illustration"
                                fill
                                className="object-contain p-6"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
