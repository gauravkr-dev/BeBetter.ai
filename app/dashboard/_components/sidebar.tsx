'use client';

import * as React from 'react';


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
    BringToFront,
    HandCoins,
    MessagesSquare,
    NotebookText,
    Users,
    VideoIcon,
    Wallet,
} from 'lucide-react';
import UserProfile from './user-profile';
import HeaderSidebar from './sidebar-header';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

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
        href: '/dashboard/career-hub/jobs',
    },
    {
        icon: BringToFront,
        label: 'Internships',
        href: '/dashboard/career-hub/internships',
    },
    {
        icon: Users,
        label: 'Hackathons',
        href: '/dashboard/career-hub/hackathons',
    },
    {
        icon: HandCoins,
        label: 'Scholarships',
        href: '/dashboard/career-hub/scholarships',
    },
    {
        label: 'Chatbot',
        icon: MessagesSquare,
        href: '/dashboard/chatbot'
    }
];

export const DashboardSidebar = () => {
    const pathname = usePathname();
    return (
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
                                    <Link href={item.href} className="flex items-center gap-2">
                                        <item.icon className="mr-2 h-4 w-4" />
                                        <span className="text-xs">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                {/* Nav Main */}
            </SidebarContent>
            <SidebarFooter>
                {/* Nav User */}
                <UserProfile />
                {/* Nav User */}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
};