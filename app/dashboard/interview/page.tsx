import React, { Suspense } from 'react'
import { InterviewHeader } from './_components/interview-header'
import StartInterviewPart from './_components/start-interview-part'
import { ArrowRight } from 'lucide-react'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Loader from '@/components/Loader'

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
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>
            {/* Interview Header Section */}
            <InterviewHeader />

            {/* Start Interview Section */}
            <button className='group text-sm flex items-center mt-6 px-4 md:px-12'>
                <div className='bg-blue-100 px-3 py-1.5 rounded text-black'>
                    <span>Start Interview</span>
                    <ArrowRight className='group-hover:translate-x-0.5 transition size-5 inline-flex ml-1' />
                </div>
            </button>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div className='pt-18 pb-18'><Loader /></div>}>
                    <ErrorBoundary fallback={<div className='mt-4 px-4 md:px-12 text-center justify-center flex text-red-500'>Failed to load interview agents.</div>}>
                        <StartInterviewPart />
                    </ErrorBoundary>

                </Suspense>
            </HydrationBoundary>

            {/* // Feedback Section */}
            <button className='group text-sm flex items-center my-6 px-4 md:px-12'>
                <div className='bg-blue-100 px-3 py-1.5 rounded text-black'>
                    <span>Check Feedback</span>
                    <ArrowRight className='group-hover:translate-x-0.5 transition size-5 inline-flex ml-1' />
                </div>
            </button>

        </div>
    )
}

export default InterviewPage
