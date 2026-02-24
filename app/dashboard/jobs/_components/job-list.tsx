/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowRight, ExternalLink, FunnelX, Heart, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LikeButton } from "@/components/like-button";
import { JobsFilterDialog } from "./jobs-filter-dialog";
import EmptyState from "../../interview/_components/empty-state";
import { LoaderFive } from "@/components/ui/loader";

export default function JobList() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [showWatchlist, setShowWatchlist] = useState(false);
    const [loading, setLoading] = useState(true);


    const searchParams = useSearchParams();

    useEffect(() => {
        const query = searchParams?.toString() ?? "";
        const url = query ? `/api/jobs?${query}` : `/api/jobs`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setLoading(false);
            });
    }, [searchParams]);

    useEffect(() => {
        const saved = localStorage.getItem("watchlist");
        if (saved) setWatchlist(JSON.parse(saved));
    }, []);

    const toggleWatchlist = (job: any) => {
        const exists = watchlist.find(j => j.id === job.id);

        let updated;
        if (exists) {
            updated = watchlist.filter(j => j.id !== job.id);
        } else {
            updated = [...watchlist, job];
        }

        setWatchlist(updated);
        localStorage.setItem("watchlist", JSON.stringify(updated));
    };


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

    const displayedJobs = showWatchlist ? watchlist : jobs;
    if (loading) {
        return (
            <div className='pt-48 flex items-center justify-center'>
                <LoaderFive text="Loading Jobs..." />
            </div>
        );
    }

    // if (displayedJobs.length === 0) {
    //     return (
    //         <EmptyState
    //             title={showWatchlist ? "Your watchlist is empty" : "No jobs found with the current filters"}
    //             className=" min-h-[70vh] "
    //         />
    //     )
    // }

    return (
        <>
            <div className="flex items-center justify-between px-3 md:px-8 mt-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center hover:cursor-pointer group text-sm border font-medium rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                        aria-label="Open job filters"
                    >
                        <FunnelX className="size-4 mr-2" />
                        Filter Jobs
                        <ArrowRight className="group-hover:translate-x-0.5 transition size-4 inline-flex ml-2" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowWatchlist(prev => !prev)}
                        className="flex items-center hover:cursor-pointer group text-sm border font-medium rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
                        aria-label="Open job filters"
                    >
                        {showWatchlist ? "All Jobs" : <><Heart className="size-4 mr-2" /> Watchlist</>}

                        <ArrowRight className="group-hover:translate-x-0.5 transition size-4 inline-flex ml-2" />
                    </button>
                </div>

                <JobsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 px-3 md:px-8">
                {displayedJobs.length === 0 ? (
                    <EmptyState
                        title={showWatchlist ? "Your watchlist is empty" : "No jobs found"}
                        className=" min-h-[60vh] col-span-full "
                    />
                ) : (
                    displayedJobs.map((job: any) => (
                        <div key={job.id} className="relative border px-4 pt-20 pb-4 rounded-xl dark:bg-[#121212] space-y-4 h-48 hover:translate-y-[-2px] transition overflow-hidden hover:border-blue-500">
                            <div className="absolute left-4 top-4 right-4 flex items-start justify-between">
                                <div className="flex flex-col max-w-[65%]">
                                    <h2 className="text-lg font-medium leading-tight line-clamp-2 overflow-hidden break-words">
                                        {job.title}
                                    </h2>
                                    <p className="text-xs mt-1 truncate">{job.company.display_name}</p>
                                </div>

                                <div className="flex flex-row items-end gap-2 ml-4 flex-shrink-0">
                                    <p className="text-xs border rounded-full px-2 py-1 truncate">{timeAgo(job.created)}</p>
                                    {job.category && (
                                        <span className="text-xs border px-2 py-1 rounded-full max-w-[160px] overflow-hidden text-ellipsis truncate inline-block">
                                            {renderCategory(job.category)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className="mt-2 text-xs line-clamp-2">
                                {job.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className="flex items-center gap-1 text-sm">
                                    <MapPin className=" text-blue-500 size-4" />
                                    <p className="text-sm">{job.location.display_name}</p>

                                </span>
                                <div className="flex items-center justify-between gap-2">
                                    <LikeButton
                                        active={Boolean(watchlist.find((j: any) => j.id === job.id))}
                                        onChange={() => toggleWatchlist(job)}
                                    >
                                        Like
                                    </LikeButton>
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
                    ))
                )}
            </div>
        </>
    );
}
