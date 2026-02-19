'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';

export const useCreateMockTestFeedback = () => {
    const trpc = useTRPC();
    return useMutation(
        trpc.mockTestOverallFeedback.create.mutationOptions({
            onSuccess: async () => {
            },
            onError: (e) => {
                toast.error(e.message || 'Failed to create mock test feedback.');
            },
        })
    );
};
