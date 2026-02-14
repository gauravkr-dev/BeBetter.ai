"use client"
import React, { useState } from 'react'
import EmptyState from '../interview/_components/empty-state'
import { Button } from '@/components/ui/button'
import { useCreateChat } from '@/hooks/use-create-chat';
import { ChatTitleDialog } from './[chatId]/_components/chat-title-dialog';
import { ArrowRight } from 'lucide-react';

const ChatbotClient = () => {
    const createChat = useCreateChat();
    const [openDialog, setOpenDialog] = useState(false);
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
                    onClick={() =>
                        setOpenDialog(true)
                    }
                >
                    Create a new chat
                    <ArrowRight className='group-hover:translate-x-1 transition-transform' />
                </Button>
            </div>
        </>
    )
}

export default ChatbotClient
