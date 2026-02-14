"use client"
import React, { useState } from 'react'
import ChatHeader from './_components/chat-header'
import ChatPart from './_components/chat-part'
import { useCreateChat } from '@/hooks/use-create-chat';
import { ChatTitleDialog } from './_components/chat-title-dialog';

const ClientPage = () => {
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
            <div className='px-4 md:px-12 max-h-screen'>
                <ChatHeader setOpenDialog={setOpenDialog} />
                <ChatPart />
            </div>
        </>
    )
}

export default ClientPage
