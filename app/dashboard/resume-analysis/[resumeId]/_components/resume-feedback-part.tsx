"use client";
import { useParams } from "next/navigation";

export const ResumeFeedbackPart = () => {
    const { resumeId } = useParams();
    return (
        <div>
            Resume Feedback Part
            <div>Resume ID: {resumeId}</div>
        </div>
    )
}