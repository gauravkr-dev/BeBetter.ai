import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }
    return (
        <div className="p-6">
            <div className="rounded-lg bg-card p-6 text-card-foreground">
                Hii from dashboard page
            </div>
        </div>
    )
}

export default page
