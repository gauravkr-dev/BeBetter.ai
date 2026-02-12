"use client";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";
import EmptyState from "../../interview/_components/empty-state";

export const ResumeList = () => {

    const trpc = useTRPC();
    const { data: resumes } = useSuspenseQuery(trpc.resume.getMany.queryOptions());
    return (
        <div>
            {resumes.length === 0 ? (
                <EmptyState title="No resumes uploaded yet." />
            ) : (
                <ul className="space-y-4">
                    {resumes.map((resume) => (
                        <li key={resume.id} className="p-4 border rounded-md">
                            <h3 className="text-lg font-semibold">{resume.fileName}</h3>
                            <p className="text-sm text-gray-500">Uploaded on {new Date(resume.createdAt).toLocaleDateString()}</p>
                            <p> {resume.feedback == null ? "No feedback yet." : typeof resume.feedback === "string" ? resume.feedback : JSON.stringify(resume.feedback)}</p>
                        </li>
                    ))}
                </ul>
            )
            }
        </div >
    )
}