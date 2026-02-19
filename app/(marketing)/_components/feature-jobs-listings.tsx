"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function FeatureJobListings() {
    return (
        <section className="w-full py-18">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Left Side - Image */}
                    <div className="relative flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-2xl flex items-center justify-center">
                            <Image
                                src="/jobs.svg"
                                alt="Smart Job Listings Illustration"
                                fill
                                className="object-contain p-6"
                            />
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Discover Jobs That Match Your Tech Stack
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            Find curated job opportunities tailored to your skills, preferred
                            technologies, and career goals. Filter roles based on your tech
                            stack, experience level, location, and work type — all in one place.
                        </p>

                        <p className="text-muted-foreground leading-relaxed">
                            Whether you are looking for remote work, on-site roles, or hybrid
                            positions, our smart filtering system ensures you only see the
                            opportunities that truly match your profile.
                        </p>

                        <ul className="space-y-4 pt-4">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Filter by tech stack (React, Node, Python, etc.)
                                </p>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Choose location and preferred work type
                                </p>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                <p className="text-muted-foreground">
                                    Discover curated roles matched to your profile
                                </p>
                            </li>
                        </ul>

                        {/* CTA */}
                        <div className="pt-6">
                            <Link href="/sign-up">
                                <Button className="group cursor-pointer" variant={"outline"}>
                                    Explore Jobs
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
