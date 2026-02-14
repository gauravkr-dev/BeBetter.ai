import React from 'react'
import { ResumeFeedbackPart } from './_components/resume-feedback-part'
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
        <div className='px-4 md:px-12 py-6'>
            <ResumeFeedbackPart />
        </div>
    )
}

export default page
