import { Button } from '@/components/ui/button'
import { ArrowRight, CircleUser } from 'lucide-react'
import React from 'react'

interface ChatHeaderProps {
    setOpenDialog: (open: boolean) => void;
}
const ChatHeader = ({ setOpenDialog }: ChatHeaderProps) => {
    return (
        <div className='flex items-center justify-between mt-4'>

            <h1 className='text-lg font-medium mb-4 flex items-center gap-2'> <CircleUser /> Gaurav Bhaiya (Senior)</h1>
            <Button
                variant="outline"
                className='mt-4 cursor-pointer group'
                onClick={() =>
                    setOpenDialog(true)
                }
            >
                New Chat
                <ArrowRight className='group-hover:translate-x-1 transition-transform' />
            </Button>
        </div>
    )
}

export default ChatHeader
