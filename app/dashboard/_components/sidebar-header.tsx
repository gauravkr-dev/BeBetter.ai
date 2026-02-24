"use client";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from '@/components/animate-ui/components/radix/sidebar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeaderSidebar = () => {
    const router = useRouter();
    const { isMobile, setOpen, setOpenMobile } = useSidebar();

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                onClick={() => {
                                    router.push("/dashboard");
                                    if (isMobile) {
                                        setOpenMobile(false);
                                    } else {
                                        setOpen(false);
                                    }
                                }}
                                size="lg"
                                className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-900">
                                    <Image src="/logo1.png" alt="Logo" width={24} height={24} />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        BeBetter.ai
                                    </span>
                                    <span className="truncate text-xs">
                                        Make your life better
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

        </>
    )
}

export default HeaderSidebar
