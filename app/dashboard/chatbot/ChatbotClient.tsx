"use client"
import React, { useState } from 'react'
import EmptyState from '../interview/_components/empty-state'
import { Button } from '@/components/ui/button'
import { useCreateChat } from '@/hooks/use-create-chat';
import { ChatTitleDialog } from './[chatId]/_components/chat-title-dialog';
import { ArrowRight } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { MAX_FREE_CHATS } from '@/modules/premium/constant';
import { toast } from 'sonner';

const ChatbotClient = () => {
    const createChat = useCreateChat();
    const [openDialog, setOpenDialog] = useState(false);
    const trpc = useTRPC();
    const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());
    const { data: currentSubscription } = useQuery(
        trpc.premium.getCurrentSubscription.queryOptions()
    )

    if (!currentSubscription && data === undefined) {
        return null;
    }
    const limitReached = (data?.chatsCreated ?? 0) >= MAX_FREE_CHATS;

    return (
        <>
            <ChatTitleDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                onSubmit={(title) => {
                    createChat.mutate({
                        title: title || "Untitled Chat",
                    })
                }} />
            <div className='flex flex-col items-center justify-center h-full'>
                <EmptyState
                    title="Your Gaurav Bhaiya is ready to assist you!" />
                <Button
                    variant="outline"
                    className='mt-4 cursor-pointer group'
                    onClick={() => {
                        if (limitReached) {
                            toast.warning("Free limit reached. Please upgrade your plan.");
                            return;
                        }

                        setOpenDialog(true);
                    }}
                >
                    Create a new chat
                    <ArrowRight className='group-hover:translate-x-1 transition-transform' />
                </Button>
            </div>
        </>
    )
}

export default ChatbotClient
