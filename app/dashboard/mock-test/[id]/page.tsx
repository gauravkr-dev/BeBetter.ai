
import React from 'react'
import { MockTestHeader } from './_components/mock-test-header'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const page = async () => {
    // Check authentication
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }
    return (
        <div>
            <MockTestHeader />
        </div>
    )
}

export default page
