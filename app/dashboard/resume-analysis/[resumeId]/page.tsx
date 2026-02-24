import React, { Suspense } from 'react'
import { ResumeFeedbackPart } from './_components/resume-feedback-part'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorState } from '@/components/Error'
import { getQueryClient, trpc } from '@/trpc/server'
import { LoaderFive } from '@/components/ui/loader'

interface Props {
    params: Promise<{ resumeId: string }>
}

const page = async ({ params }: Props) => {
    const { resumeId } = await params
    // Check authentication
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.resume.getById.queryOptions({ id: resumeId }));
    return (
        <div className='px-4 md:px-12 py-6'>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div className='pt-48 flex items-center justify-center'><LoaderFive text="Loading Resume Feedback..." /></div>}>
                    <ErrorBoundary
                        fallback={
                            <div
                                className='mt-4 px-4 md:px-12 text-center justify-center flex mt-48 text-red-500'>
                                <ErrorState />
                            </div>
                        }>
                        <ResumeFeedbackPart />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </div>
    )
}

export default page
