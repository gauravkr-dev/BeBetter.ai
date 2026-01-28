import React from 'react'
import { DashboardSidebar } from './_components/sidebar'
import { SidebarProvider } from '@/components/animate-ui/components/radix/sidebar'
import DashboardNavbar from './_components/dashboard-navbar'


interface layoutProps {
    children: React.ReactNode
}

const layout = ({ children }: layoutProps) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main className="flex flex-col h-screen w-screen bg-muted">
                <DashboardNavbar />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default layout
