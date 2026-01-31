import React, { Suspense } from 'react'
import { InterviewHeader } from './_components/interview-header'
import StartInterviewPart from './_components/start-interview-part'
import { ArrowRight } from 'lucide-react'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

const InterviewPage = () => {
    // Pre-fetch data of agents on the server side 
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    return (
        <div>
            {/* Interview Header Section */}
            <InterviewHeader />

            {/* Start Interview Section */}
            <h2 className='group text-xl font-medium flex items-center mt-4 px-4 md:px-12'>
                <span>Start Interview <span className='group-hover:translate-x-0.5 transition inline-flex'>---</span></span>
                <ArrowRight className='group-hover:translate-x-0.5 transition size-5 inline-flex' />
            </h2>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div className='mt-4 px-4 md:px-12 text-center justify-center flex'>Loading...</div>}>
                    <ErrorBoundary fallback={<div className='mt-4 px-4 md:px-12 text-center justify-center flex text-red-500'>Failed to load interview agents.</div>}>
                        <StartInterviewPart />
                    </ErrorBoundary>

                </Suspense>
            </HydrationBoundary>

        </div>
    )
}

export default InterviewPage
