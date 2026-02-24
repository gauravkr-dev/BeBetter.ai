import React, { Suspense } from 'react'
import { InterviewHeader } from './_components/interview-header'
import { ArrowRight } from 'lucide-react'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { CheckFeedbackPart } from './_components/check-feedback-part'
import { ErrorState } from '@/components/Error'
import { LoaderFive } from '@/components/ui/loader'

const InterviewPage = async () => {

    // Check authentication
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }
    // Pre-fetch data of agents on the server side 
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({ page: 1 }));

    return (
        <div>
            {/* Interview Header Section */}
            <InterviewHeader />
            {/* // Feedback Section */}
            <button className='group text-sm flex items-center px-4 md:px-12 mt-8'>
                <div className='bg-blue-100 px-3 py-1.5 rounded text-black'>
                    <span>Check Feedback</span>
                    <ArrowRight className='group-hover:translate-x-0.5 transition size-5 inline-flex ml-1' />
                </div>
            </button>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div className='pt-24 flex items-center justify-center'><LoaderFive text="Loading Interview Data..." /></div>}>
                    <ErrorBoundary
                        fallback={
                            <div
                                className='px-4 md:px-12 text-center justify-center flex mt-24 text-red-500'>
                                <ErrorState />
                            </div>
                        }>
                        <CheckFeedbackPart />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>

        </div>
    )
}

export default InterviewPage
