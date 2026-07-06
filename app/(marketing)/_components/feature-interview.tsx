"use client";

import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeatureInterviewAI() {
    return (
        <section className="max-w-6xl mx-auto py-12">
            <div className="container mx-auto px-1 md:px-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">

                    {/* Left Side - Content */}
                    <div className="space-y-6 border border-border rounded-2xl p-6">

                        <h2 className="text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-2 mb-8 font-serif">
                            {/* <FastForward className="inline-block text-yellow-500" size={24} /> */}
                            Practice Real Interviews With AI
                        </h2>
                        <div className="">
                            <p className="text-muted-foreground leading-relaxed">
                                Experience realistic interview simulations powered by intelligent AI agents.
                                Create your own interviewer by defining an agent name and custom instructions,
                                and let the AI conduct a structured interview tailored to your goals.
                            </p>

                            <p className="text-muted-foreground leading-relaxed mt-3">
                                Once the interview is complete, receive a detailed performance report including
                                strengths, weaknesses, communication quality, and actionable improvement insights —
                                just like a real interview feedback.
                            </p>

                            <ul className="space-y-4 pt-4 mt-4">
                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    <p className="text-muted-foreground">
                                        Create custom AI interviewers with your own instructions
                                    </p>
                                </li>

                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    <p className="text-muted-foreground">
                                        Simulate real-world interview scenarios and questions
                                    </p>
                                </li>

                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    <p className="text-muted-foreground">
                                        Get detailed feedback on performance, confidence, and weaknesses
                                    </p>
                                </li>
                            </ul>

                            {/* CTA */}
                            <div className="pt-6">
                                <Link href="/sign-up">
                                    <Button className="group cursor-pointer" variant={"outline"}>
                                        <MonitorPlay />
                                        Start AI Interview
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image / Illustration */}
                    <div className="relative flex justify-center border border-border rounded-2xl h-full">
                        <div className="relative w-full aspect-square  flex items-center justify-center">
                            {/* Replace this image with your actual illustration */}
                            <Image
                                src="/interview.svg"
                                alt="AI Interview Illustration"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
