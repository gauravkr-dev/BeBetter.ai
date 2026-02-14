import React from 'react'
import { MockTestOverallFeedbackPart } from './_components/mock-test-overall-feedback-part'
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
            <MockTestOverallFeedbackPart />
        </div>
    )
}

export default page
