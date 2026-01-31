import React from 'react'
import { DashboardSidebar } from './_components/sidebar'
import {
    SidebarProvider,
    SidebarInset,
} from '@/components/animate-ui/components/radix/sidebar'
import DashboardNavbar from './_components/dashboard-navbar'

interface layoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: layoutProps) => {
    return (
        <SidebarProvider className="min-h-screen bg-background text-foreground">
            <DashboardSidebar />
            <SidebarInset className="">
                <DashboardNavbar />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout
