"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeatureMockTest() {
    return (
        <section className="w-full py-18">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left Side - Image */}
                    <div className="relative flex justify-center order-1 md:order-none">
                        <div className="relative w-full max-w-md aspect-square rounded-2xl flex items-center justify-center">
                            <Image
                                src="/online-test.svg"
                                alt="Smart Mock Test Illustration"
                                fill
                                className="object-contain p-6"
                            />
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Personalized Tests That Match Your Level
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            Choose your preferred topics and describe your preparation level.
                            Our intelligent system dynamically generates mock tests tailored
                            specifically to your strengths, weaknesses, and goals.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            After completing the test, receive a comprehensive performance report
                            including accuracy, topic-wise breakdown, difficulty analysis,
                            and clear improvement recommendations.
                        </p>

                        <ul className="space-y-4 pt-4">
                            <li className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Select custom topics and define your skill level
                                </p>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    AI-generated questions aligned with your preparation
                                </p>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Detailed feedback with accuracy and improvement insights
                                </p>
                            </li>
                        </ul>

                        {/* CTA */}
                        <div className="pt-6">
                            <Link href="/sign-up">
                                <Button className="group cursor-pointer" variant={"outline"}>
                                    Take a Mock Test
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
