/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ExternalLink, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { LikeButton } from "@/components/like-button";

export default function JobList() {
    const [jobs, setJobs] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/jobs")
            .then(res => res.json())
            .then(setJobs);
    }, []);

    const renderCategory = (category: any) => {
        if (!category) return null;
        if (typeof category === "string") return category;
        if (typeof category === "object") return category.label ?? category.tag ?? JSON.stringify(category);
        return String(category);
    };

    function timeAgo(date: string) {
        // eslint-disable-next-line react-hooks/purity
        const diff = Date.now() - new Date(date).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return days === 0 ? "Today" : `${days} days ago`;
    }
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 px-3 md:px-8">
            {jobs.map((job: any) => (
                <div key={job.id} className="border px-4 py-3 rounded-xl dark:bg-[#121212] space-y-4">
                    {/* <h2 className="font-semibold">{job.title}</h2> */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col justify-between">
                            <h2 className="text-lg font-medium leading-tight">
                                {job.title}
                            </h2>
                            <p className="text-xs">{job.company.display_name}</p>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs border rounded-full px-2 py-1 truncate">{timeAgo(job.created)}</p>
                            {job.category && (
                                <span className="text-xs border px-2 py-1 rounded-full whitespace-nowrap">
                                    {renderCategory(job.category)}
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="mt-3 text-xs line-clamp-2">
                        {job.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm">
                            <MapPin className=" text-blue-500 size-4" />
                            <p className="text-sm">{job.location.display_name}</p>

                        </span>
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center justify-center">
                                <LikeButton>Like</LikeButton>
                            </div>
                            <a
                                href={job.redirect_url}
                                target="_blank"
                                className=" flex items-center gap-1 text-xs border px-2 py-1 rounded-full hover:text-blue-500 transition"
                            >
                                Apply <ExternalLink className="size-3.5" />
                            </a>

                        </div>
                    </div>

                </div>
            ))}
        </div>
    );
}
