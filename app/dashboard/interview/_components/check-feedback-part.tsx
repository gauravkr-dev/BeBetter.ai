"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */


import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import EmptyState from "./empty-state";
import { DataPagination } from "./data-pagination";
import { useAgentsFilter } from "@/modules/agents/hooks/use-filter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AgentDeleteUpdateDialog } from "./agent-delete-update-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

export const CheckFeedbackPart = () => {
    const [filters, setFilters] = useAgentsFilter();
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ page: filters.page }));



    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                // Invalidate the agents list to reflect the deletion
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({ page: filters.page }),
                );
                toast.success("Feedback deleted successfully.");
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to delete feedback.");
            }
        })
    )

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Delete Feedback",
        "Are you sure you want to delete this feedback? This action cannot be undone.",
    )
    const router = useRouter();
    return (
        <>
            <RemoveConfirmation />
            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 mx-auto items-center justify-center mt-8 px-4 md:px-12">
                {agents?.items.map((agent: any) => (
                    <div key={agent.id} className="relative p-4 mb-4 border rounded-lg w-48 h-48 dark:bg-[#121212] hover:translate-y-[-2px] transition-all duration-200 ease-in-out flex flex-col justify-between overflow-hidden">
                        <div className='w-full px-1 flex gap-3 items-start'>
                            <div className='border font-medium flex items-center justify-center border-primary rounded-full flex-shrink-0 h-8 w-8'>
                                {agent.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium truncate">{agent.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true, })}</p>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 mt-2 overflow-hidden">
                            <p className='text-sm break-words'>
                                <span className="rounded bg-green-50 dark:bg-green-900/10 font-medium text-green-500 inline-block max-w-[9rem] align-middle truncate">{agent.name}</span>
                                <span className="ml-1 text-ellipsis overflow-hidden"> has given your feedback.</span>
                            </p>
                            <p className='text-sm mt-2 truncate'>Let&apos;s check it now!</p>
                        </div>
                        <Button
                            className='group mt-4 w-full text-sm h-8 hover:cursor-pointer'
                            variant='outline'
                            onClick={() => { router.push(`/dashboard/interview-analysis/${agent.id}`) }}>
                            View
                            <ArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
                        </Button>
                        <AgentDeleteUpdateDialog
                            onRemove={() => {
                                confirmRemove().then((confirmed) => {
                                    if (confirmed) {
                                        removeAgent.mutateAsync({ id: agent.id });
                                    }
                                });
                            }}
                            className={cn("absolute top-2 right-2")}
                        />
                    </div>
                ))}
            </div>
            {agents?.items.length > 0 && (
                <DataPagination
                    page={filters.page}
                    totalPages={agents.totalPages}
                    onPageChange={(newPage) => setFilters({ page: newPage })}
                />
            )}
            {agents?.items?.length === 0 && (
                <EmptyState
                    title="No Feedback Yet"
                />
            )}

        </>
    )
}