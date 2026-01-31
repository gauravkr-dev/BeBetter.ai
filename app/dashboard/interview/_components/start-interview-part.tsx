"use client"
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";
import { Button } from '@/components/ui/button';
import { EmptyState } from './empty-state';
import { useAgentsFilter } from '@/modules/agents/hooks/use-filter';
import { DataPagination } from './data-pagination';
import { AgentDeleteUpdateDialog } from './agent-delete-update-dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use-confirm';
import { UpdateAgentDialog } from './update-agent-dialog';
import { useState } from 'react';


const StartInterviewPart = () => {
    const [filters, setFilters] = useAgentsFilter();
    const queryClient = useQueryClient();
    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ page: filters.page }));

    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                // Invalidate the agents list to reflect the deletion
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({ page: filters.page }),
                );
                toast.success("Agent deleted successfully.");
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to delete agent.");
            }
        })
    )

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Delete Agent",
        "Are you sure you want to delete this agent? This action cannot be undone.",
    )
    return (
        <>
            <RemoveConfirmation />
            <UpdateAgentDialog
                open={updateAgentDialogOpen}
                onOpenChange={setUpdateAgentDialogOpen}
                initialValues={data.items[0]}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 mx-auto items-center justify-center mt-6 px-4 md:px-12">
                {data.items.map((agent) => (
                    <div key={agent.id} className="relative p-4 mb-4 border rounded-lg w-48 h-48 dark:bg-[#121212] hover:translate-y-[-2px] transition-all duration-200 ease-in-out">
                        <div className='w-full px-1 flex gap-3 items-start'>
                            <div className='border font-medium flex items-center justify-center border-primary rounded-full flex-shrink-0 h-8 w-8'>
                                {agent.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium truncate">{agent.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true, })}</p>
                            </div>
                        </div>
                        <div>
                            <p className='text-sm mt-2'><span className="rounded bg-yellow-200 font-medium text-yellow-900">{agent.name}</span> is ready to start the interview.</p>
                            <p className='text-sm mt-2'>Let&apos;s begin!</p>
                        </div>
                        <Button className='group mt-4 w-full text-sm h-8 hover:cursor-pointer' variant='outline'>
                            Start
                            <ArrowRight className='size-4 group-hover:translate-x-1 transition-transform' />
                        </Button>
                        <AgentDeleteUpdateDialog
                            onEdit={() => setUpdateAgentDialogOpen(true)}
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
            {data.items.length > 0 && (
                <DataPagination
                    page={filters.page}
                    totalPages={data.totalPages}
                    onPageChange={(newPage) => setFilters({ page: newPage })}
                />
            )}
            {data.items.length === 0 && (
                <EmptyState
                    title="No Interview Available"
                    description="Create AI interviewers to start practicing your interviews."
                />
            )}
        </>
    )
}

export default StartInterviewPart
