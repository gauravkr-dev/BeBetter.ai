'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';

export const useCreateResumeFeedback = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.resume.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.resume.getMany.queryOptions()
                );
            },
            onError: (e) => {
                toast.error(e.message || 'Failed to create resume feedback.');
            },
        })
    );
};
