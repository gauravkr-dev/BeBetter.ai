import { Button } from '@/components/ui/button'
import { MAX_FREE_CHATS } from '@/modules/premium/constant';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CircleUser } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner';

interface ChatHeaderProps {
    setOpenDialog: (open: boolean) => void;
}
const ChatHeader = ({ setOpenDialog }: ChatHeaderProps) => {
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
        <div className='flex items-center justify-between mt-4'>

            <h1 className='text-lg font-medium mb-4 flex items-center gap-2'> <CircleUser /> Gaurav Bhaiya (Senior)</h1>
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
                New Chat
                <ArrowRight className='group-hover:translate-x-1 transition-transform' />
            </Button>
        </div>
    )
}

export default ChatHeader
