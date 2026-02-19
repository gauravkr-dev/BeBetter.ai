"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeatureResumeAnalyzer() {
    return (
        <section className="w-full py-18">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left Side - Content */}
                    <div className="space-y-6">

                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Get Instant Resume Feedback With AI
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            Upload your resume and let our intelligent system analyze it in seconds.
                            BeBetter.ai evaluates structure, clarity, keyword relevance, formatting,
                            and overall impact — just like a professional recruiter would.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            Receive a detailed performance breakdown with strengths, improvement
                            suggestions, missing keywords, and actionable recommendations to
                            increase your chances of landing interviews.
                        </p>

                        <ul className="space-y-4 pt-4">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Smart analysis of structure and formatting
                                </p>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Keyword optimization based on job roles
                                </p>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Clear, actionable improvement suggestions
                                </p>
                            </li>
                        </ul>

                        {/* CTA */}
                        <div className="pt-6">
                            <Link href="/sign-up">
                                <Button className="group cursor-pointer" variant={"outline"}>
                                    Analyse Your Resume
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-2xl flex items-center justify-center">
                            <Image
                                src="/resume-header.svg"
                                alt="AI Resume Analyzer Illustration"
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
