"use client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/optics/card";
import Image from "next/image";
import { useState } from "react";
import { GenerateQuiesDialog } from "./generate-quies-dialog";

export const GenerateQuiesHeader = () => {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    return (
        <>
            <GenerateQuiesDialog open={isOpenDialog} onOpenChange={setIsOpenDialog} />
            <div className="flex flex-row items-center justify-center gap-8 mt-4 px-4 md:px-12">
                <Card
                    className="w-full flex flex-row items-center justify-center dark:bg-[#121212] px-4 py-6"
                    decorations
                >
                    <CardHeader className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-3">
                        <CardTitle className="text-xl font-medium font-serif">
                            AI-Powered Mock Test for Targeted Exam Preparation
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Create intelligent, topic-based mock tests in seconds using advanced AI. Practice with customized questions, challenge your understanding, and track your preparation level effectively.
                        </CardDescription>

                        <button className="w-32 bg-primary text-primary-foreground text-xs py-2 px-3 rounded hover:cursor-pointer hover:bg-primary/90" onClick={() => setIsOpenDialog(true)}>
                            Give Test
                        </button>


                    </CardHeader>

                    <CardHeader className="w-1/2 flex items-center justify-center hidden md:flex">
                        <Image src="/mock_test.svg" alt="Mock Test Header" width={250} height={100} />
                    </CardHeader>
                </Card>
            </div>
        </>
    )
}