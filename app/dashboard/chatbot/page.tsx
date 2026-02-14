import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import ChatbotClient from './ChatbotClient'

const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }

    return (
        <ChatbotClient />
    )
}

export default page
