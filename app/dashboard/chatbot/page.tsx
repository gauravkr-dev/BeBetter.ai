"use client"
import React, { useState } from 'react'
import EmptyState from '../interview/_components/empty-state'
import { Button } from '@/components/ui/button'
import { useCreateChat } from '@/hooks/use-create-chat';
import { ChatTitleDialog } from './[chatId]/_components/chat-title-dialog';

const Page = () => {
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
                    className='mt-4 cursor-pointer'
                    onClick={() =>
                        setOpenDialog(true)
                    }
                >
                    Create a new chat
                </Button>
            </div>
        </>
    )
}

export default Page
