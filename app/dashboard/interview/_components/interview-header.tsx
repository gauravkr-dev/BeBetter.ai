"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/optics/card";
import Image from "next/image";
export const InterviewHeader = () => {
    return (
        <div className="flex flex-row items-center justify-center gap-8 mt-4 px-4 md:px-12">
            <Card
                className="w-full flex flex-row items-center justify-center dark:bg-[#121212] px-4 py-6"
                decorations
            >
                <CardHeader className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-4">
                    <CardTitle className="text-xl font-medium">
                        Practice Interviews. Get Better. Get Hired.
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Create AI interviewers, practice real-world questions,
                        and get detailed feedback to improve your skills.
                    </CardDescription>

                    <button className="w-32 bg-primary text-primary-foreground text-xs py-2 px-3 rounded hover:cursor-pointer hover:bg-primary/90" >
                        Create Interview
                    </button>


                </CardHeader>

                <CardHeader className="w-1/2 flex items-center justify-center hidden md:flex">
                    <Image src="/interview-header.svg" alt="Interview Header" width={200} height={100} />
                </CardHeader>
            </Card>
        </div>
    )
}