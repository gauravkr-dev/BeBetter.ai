"use client"

import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/animate-ui/components/radix/sidebar';
import { cn } from '@/lib/utils';


const DashboardNavbar = () => {
    return (
        <>
            <nav className="flex sticky top-0 z-20 w-full bg-background h-14 items-center justify-between gap-2 border-b px-4">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-12" />
                    </div>
                </div>
                <ThemeTogglerButton className={cn("h-6 w-6 hover:cursor-pointer rounded-full")} />
            </nav>
        </>
    )
}

export default DashboardNavbar
