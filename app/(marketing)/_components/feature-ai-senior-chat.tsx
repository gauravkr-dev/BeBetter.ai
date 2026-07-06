"use client";

import { Button } from "@/components/ui/button";
import { MessageCircleQuestionMark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeatureAISeniorChat() {
    return (
        <section className="py-12 max-w-6xl mx-auto">
            <div className="container mx-auto  px-1 md:px-6">
                <div className="grid md:grid-cols-2 gap-6 items-center">

                    {/* Left Side - Content */}
                    <div className="space-y-6 border border-border rounded-2xl p-6">

                        <h2 className="text-2xl md:text-3xl font-medium font-serif tracking-tight">
                            Chat With Your Personal AI Senior
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            Create dedicated chat sections for different topics and get instant
                            guidance from your AI Senior. Whether it’s coding doubts, career
                            advice, interview preparation, or project architecture — ask anything.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            Get structured explanations, practical examples, debugging help,
                            roadmap suggestions, and real-world insights — just like having
                            an experienced senior developer by your side 24/7.
                        </p>

                        <ul className="space-y-4 pt-4">
                            <li className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Create topic-based chat sections
                                </p>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Ask coding, career, or interview-related questions
                                </p>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Get real-world, senior-level guidance instantly
                                </p>
                            </li>
                        </ul>

                        {/* CTA */}
                        <div className="pt-6">
                            <Link href="/sign-up">
                                <Button className="group cursor-pointer" variant={"outline"}>
                                    <MessageCircleQuestionMark />
                                    Start Chatting
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative flex justify-center border border-border rounded-2xl h-full">
                        <div className="relative w-full max-w-md aspect-square rounded-2xl flex items-center justify-center">
                            <Image
                                src="/chat-bot.svg"
                                alt="AI Senior Chat Illustration"
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
