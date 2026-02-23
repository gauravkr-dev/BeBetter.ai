"use client"
import { Button } from "@/components/ui/button"
import { HeaderPart } from "./header-part"
import { ArrowLeft } from "lucide-react"
import { LowerPart } from "./lower-part"
import { useRouter } from "next/navigation"

export const MockTestOverallFeedbackPart = () => {
    const router = useRouter();
    return (
        <div className="flex justify-center mb-10 mt-4 flex-col space-y-6">
            <Button variant="outline" className="group cursor-pointer max-w-max" onClick={() => router.push('/dashboard/mock-test')}>
                <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                Back
            </Button>
            <HeaderPart />
            <LowerPart />
        </div>
    )
}