"use client"
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from "date-fns";
import { Button } from '@/components/ui/button';
import { EmptyState } from './empty-state';
import { useAgentsFilter } from '@/modules/agents/hooks/use-filter';
import { DataPagination } from './data-pagination';



const StartInterviewPart = () => {
    const [filters, setFilters] = useAgentsFilter();

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ page: filters.page }));


    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-4 mx-auto items-center justify-center mt-6 px-4 md:px-12">
                {data.items.map((agent) => (
                    <div key={agent.id} className="p-4 mb-4 border rounded-lg w-48 h-48 dark:bg-[#121212] hover:translate-y-[-2px] transition-all duration-200 ease-in-out">
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
                    </div>
                ))}
            </div>
            <DataPagination
                page={filters.page}
                totalPages={data.totalPages}
                onPageChange={(newPage) => setFilters({ page: newPage })}
            />
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
