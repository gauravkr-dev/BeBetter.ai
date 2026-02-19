"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Instagram, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
    return (
        <section className="w-full py-20 bg-background" id="about">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-24 md:gap-12 items-center">

                    {/* Left Side - Founder Image */}
                    <div className="flex justify-center md:justify-start">
                        <div className="relative w-72 h-72 md:w-96 md:h-96">

                            {/* Gradient Ring */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-[4px]">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                    <Image
                                        src="/gaurav-photo.png" // <-- apni edited image ka path daal dena
                                        alt="Founder"
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>
                                <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white text-black px-3 py-1 rounded-full text-sm font-medium">
                                    Gaurav
                                </p>
                                <p className="text-center mt-8 font-serif">Founder & CEO</p>
                                <div className="absolute top-0 right-0 flex flex-col items-center gap-2">
                                    <Link href="https://github.com/gauravkr-dev">
                                        <Button variant={"outline"} className="mt-4 cursor-pointer">
                                            <Github />
                                        </Button>
                                    </Link>
                                    <Link href="https://www.linkedin.com/in/gaurav474">
                                        <Button variant={"outline"} className="mt-4 cursor-pointer">
                                            <Linkedin />
                                        </Button>
                                    </Link>
                                    <Link href="https://www.instagram.com/gauravkr_474">
                                        <Button variant={"outline"} className="mt-4 cursor-pointer">
                                            <Instagram />
                                        </Button>
                                    </Link>
                                    <Link href="mailto:gauravkumar803109@gmail.com">
                                        <Button variant={"outline"} className="mt-4 cursor-pointer">
                                            <Mail />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Side - Text Content */}
                    <div className="text-center md:text-left space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Building The Future of Career Preparation
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            BeBetter.ai is an AI-powered career growth platform built to help
                            ambitious students and professionals prepare smarter, perform better,
                            and get hired faster.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            We combine intelligent AI interview agents, realistic mock tests,
                            resume analysis, and curated job opportunities into one unified
                            ecosystem designed for modern career success.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            Preparing for interviews shouldn’t feel random. Improving your resume
                            shouldn’t feel confusing. That’s why we built BeBetter.ai — to bring
                            structure, clarity, and AI-powered intelligence into career preparation.
                        </p>

                        <p className="font-medium text-lg">
                            Help you become better — every single day.
                        </p>

                        {/* CTA Button */}
                        <div>
                            <Link href="/sign-up">
                                <Button className="group cursor-pointer" variant={"outline"}>
                                    Join BeBetter.ai
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
