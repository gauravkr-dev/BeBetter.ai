/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import EmptyState from "../../interview/_components/empty-state";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DataPagination } from "../../interview/_components/data-pagination";
import { useResumeFilter } from "@/modules/resume/hooks/use-filter";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { ResumeDeleteDialog } from "./resume-delete-dialog";
import { useRouter } from "next/navigation";

export const ResumeList = () => {
    const [filters, setFilters] = useResumeFilter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: resumes } = useSuspenseQuery(trpc.resume.getMany.queryOptions({ page: filters.page }));
    // API returns a paginated payload like { items: Resume[], totalPages: number }
    const items: any[] = Array.isArray(resumes) ? resumes : (resumes?.items ?? []);
    const totalPages = resumes?.totalPages ?? 0;

    const removeResume = useMutation(
        trpc.resume.delete.mutationOptions({
            onSuccess: async () => {
                // Invalidate the resume list to reflect the deletion
                await queryClient.invalidateQueries(trpc.resume.getMany.queryOptions({ page: filters.page }));
                toast.success("Resume deleted successfully.");
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to delete resume.");
            }
        })
    );

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Delete Resume",
        "Are you sure you want to delete this resume? This action cannot be undone.",
    )
    return (
        <>
            <RemoveConfirmation />
            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 mx-auto items-center justify-center mt-6 px-4 md:px-12">
                {items.map((resume: any) => (
                    <div key={resume.id} className="group relative p-4 mb-4 border rounded-lg w-48 h-48 dark:bg-[#121212] hover:translate-y-[-2px] transition-all duration-200 ease-in-out flex flex-col justify-between overflow-hidden">
                        <div className='w-full px-1 flex gap-3 items-start'>
                            <div className='border font-medium flex items-center justify-center border-primary rounded-full flex-shrink-0 h-8 w-8'>
                                {resume.fileName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium truncate">{resume.fileName}</h3>
                                <p className="text-xs text-muted-foreground truncate">{formatDistanceToNow(new Date(resume.createdAt), { addSuffix: true, })}</p>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 mt-2 overflow-hidden">
                            <p className='text-sm break-words'>
                                <span className="rounded bg-green-200 font-medium text-green-900 inline-block max-w-[9rem] align-middle truncate">{resume.fileName}</span>
                                <span className="ml-1 text-ellipsis overflow-hidden"> is analyzed.</span>
                            </p>
                            <p className='text-sm mt-2 truncate'>Check it now!</p>
                        </div>
                        <Button
                            className='group mt-4 w-full text-sm h-8 hover:cursor-pointer'
                            variant='outline'
                            onClick={() =>
                                router.push(`/dashboard/resume-analysis/${resume.id}`)
                            }>
                            Check
                            <ArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
                        </Button>
                        <ResumeDeleteDialog
                            onRemove={() => {
                                confirmRemove().then((confirmed) => {
                                    if (confirmed) {
                                        removeResume.mutateAsync({ id: resume.id });
                                    }
                                });
                            }}
                            className={cn("absolute top-2 right-2 hover:cursor-pointer hover:bg-transparent")}
                        />
                    </div>
                ))}
            </div>
            {items.length > 0 && (
                <DataPagination
                    page={filters.page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setFilters({ page: newPage })}
                />
            )}
            {items.length === 0 && (
                <EmptyState
                    title="No resumes uploaded yet."
                />
            )}
        </>
    )
}