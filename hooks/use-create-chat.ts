'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';

export const useCreateChat = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.chat.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.chat.list.queryOptions()
                );

                router.push(`/dashboard/chatbot/${data.id}`);
            },
            onError: () => {
                toast.error('Failed to create chat.');
            },
        })
    );
};
