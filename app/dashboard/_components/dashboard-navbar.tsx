"use client"

import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler'
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/animate-ui/components/radix/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import Link from 'next/link';


const DashboardNavbar = () => {
    return (
        <>
            <nav className="flex sticky top-0 z-20 w-full bg-background h-14 items-center justify-between gap-2 border-b px-4">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 cursor-pointer rounded-lg border border-border" />
                        <Separator orientation="vertical" className="mr-2 h-12" />
                    </div>
                </div>
                <div className='flex items-center flex-row justify-between gap-8'>
                    <Link href="/dashboard/upgrade">
                        <Button variant="outline" size="sm" className="h-7 cursor-pointer">
                            <Gem />
                            Upgrade
                        </Button>
                    </Link>
                    <ThemeTogglerButton className={cn("h-6 w-6 hover:cursor-pointer rounded-full")} />
                </div>
            </nav>
        </>
    )
}

export default DashboardNavbar
