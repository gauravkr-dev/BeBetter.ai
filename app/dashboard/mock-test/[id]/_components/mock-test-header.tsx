"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TestQuestions } from "./test-questions"

export const MockTestHeader = () => {
    return (
        <div className="flex flex-col md:px-12 px-4 py-4">
            <div className="flex items-start justify-between flex-col md:flex-row">
                <Button variant="outline" className="group mb-4 cursor-pointer" onClick={() => window.history.back()}>
                    <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </Button>
                <Button variant="outline">
                    👍 Calm your mind and give the best 👍
                </Button>
            </div>

            <div className="items-center mt-6">
                <TestQuestions />
            </div>
        </div>
    )
}