"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/optics/card";
import Image from "next/image";
import { useState } from "react";
import { ResumeUploadDialog } from "./resume-upload-dialog";

export const ResumeHeader = () => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    return (
        <>
            <ResumeUploadDialog open={isOpenDialog} onOpenChange={setIsOpenDialog} />
            <div className="flex flex-row items-center justify-center gap-8 mt-4 px-4 md:px-12">
                <Card
                    className="w-full flex flex-row items-center justify-center dark:bg-[#121212] px-4 py-6"
                    decorations
                >
                    <CardHeader className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-4">
                        <CardTitle className="text-xl font-medium font-serif">
                            Analyze Your Resume And Make it Job Ready!
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Upload your resume and get AI-powered feedback to improve it and boost your chances of landing your dream job.
                        </CardDescription>

                        <button className="w-32 bg-primary text-primary-foreground text-xs py-2 px-3 rounded hover:cursor-pointer hover:bg-primary/90" onClick={() => setIsOpenDialog(true)}>
                            Upload Resume
                        </button>


                    </CardHeader>

                    <CardHeader className="w-1/2 flex items-center justify-center hidden md:flex">
                        <Image src="/resume-header.svg" alt="Resume Header" width={200} height={100} />
                    </CardHeader>
                </Card>
            </div>
        </>
    )
}