'use client';

import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';


import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarRail,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/animate-ui/components/radix/sidebar';

import {
    CircleUser,
    NotebookText,
    ScrollText,
    Trash2,
    VideoIcon,
    Wallet,
} from 'lucide-react';
import UserProfile from './user-profile';
import HeaderSidebar from './sidebar-header';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use-confirm';
import { ChatGetOne } from '@/modules/chatbot/server/chat/types';
import { useState } from 'react';
import { ChatTitleDialog } from '../chatbot/[chatId]/_components/chat-title-dialog';

const id = uuidv4();

const Section = [
    {
        icon: VideoIcon,
        label: 'Interview',
        href: '/dashboard/interview'
    },
    {
        icon: NotebookText,
        label: "Mock Test",
        href: '/dashboard/mock-test'
    },
    {
        icon: Wallet,
        label: 'Jobs Listings',
        href: '/dashboard/jobs',
    },
    {
        icon: ScrollText,
        label: 'Resume Analysis',
        href: '/dashboard/resume-analysis',
    },
    {
        label: 'Gaurav Bhaiya (Senior)',
        icon: CircleUser,
        href: `/dashboard/chatbot/${id}`,
    },
];

interface DashboardSidebarProps {
    initialValues?: ChatGetOne;
}

export const DashboardSidebar = ({ initialValues }: DashboardSidebarProps) => {
    const pathname = usePathname();
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data } = useSuspenseQuery(trpc.chat.list.queryOptions());

    const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const createChat = useMutation(
        trpc.chat.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.chat.list.queryOptions(),
                );
                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.chat.getById.queryOptions({ chatId: initialValues.id }),
                    );
                }
                console.log("Chat created:", data);
                router.push(`/dashboard/chatbot/${data.id}`);
            },
            onError: () => {
                toast.error("Failed to create chat.");
            }
        })
    );

    const deleteChat = useMutation(
        trpc.chat.delete.mutationOptions({
            onSuccess: async () => {
                // invalidate the chat list query to reflect the deletion
                await queryClient.invalidateQueries(
                    trpc.chat.list.queryOptions(),
                );
                toast.success("Chat deleted successfully.");
            },
            onError: () => {
                toast.error("Failed to delete chat.");
            }
        })
    )

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Delete Chat",
        "Are you sure you want to delete this chat? This action cannot be undone.",
    )

    const onClickOptions = (href: string) => {
        if (href === `/dashboard/chatbot/${id}`) {
            setOpenDialog(true);
        } else {
            router.push(href);
        }
    };


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
            <RemoveConfirmation />
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <HeaderSidebar />
                </SidebarHeader>

                <SidebarContent>
                    {/* Nav Main */}
                    <SidebarGroup>
                        <SidebarMenu>
                            {Section.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild className={cn(pathname === item.href && 'bg-sidebar-accent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-accent-foreground')}>
                                        <button className="flex items-center" onClick={() => onClickOptions(item.href)}>
                                            <item.icon className="mr-2 h-4 w-4" />
                                            <span className="text-xs">{item.label}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>

                    {/* Chat list moved into SidebarContent to avoid layout gap */}
                    <div className="mx-2 mt-2 overflow-auto no-scrollbar flex-1 flex flex-col gap-2">
                        {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            data?.map((chat: any) => (
                                <SidebarMenuItem
                                    key={chat.id}
                                    className="relative"
                                    onMouseEnter={() => setHoveredChatId(String(chat.id))}
                                    onMouseLeave={() => setHoveredChatId(null)}
                                >
                                    <SidebarMenuButton asChild className={cn(pathname === `/dashboard/chatbot/${chat.id}` && 'bg-sidebar-accent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-accent-foreground')}>
                                        <Link
                                            href={`/dashboard/chatbot/${chat.id}`}
                                            className="flex items-center gap-2 border"
                                        >
                                            <span className="text-xs">{chat.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <Trash2
                                        className={cn('absolute size-4 right-2 top-1/2 -translate-y-1/2 text-red-500 cursor-pointer', hoveredChatId === String(chat.id) ? 'block' : 'hidden')}
                                        onClick={() => {
                                            confirmRemove().then((confirmed) => {
                                                if (confirmed) {
                                                    deleteChat.mutateAsync({ chatId: chat.id });
                                                }
                                            });
                                        }}
                                    />
                                </SidebarMenuItem>
                            ))
                        }
                    </div>
                    {/* Nav Main */}
                </SidebarContent>
                <SidebarFooter>
                    {/* Nav User */}
                    <UserProfile />
                    {/* Nav User */}
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>
        </>
    );
};