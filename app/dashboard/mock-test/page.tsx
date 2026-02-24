import React, { Suspense } from 'react'
import { GenerateQuiesHeader } from './_components/generate-quies-header'
import { ArrowRight } from 'lucide-react'
import { CheckFeedbackPart } from './_components/check-feedback'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import Loader from '@/components/Loader'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorState } from '@/components/Error'
import { getQueryClient, trpc } from '@/trpc/server'

const MockPage = async () => {
    // Check authentication
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.mockTest.getMany.queryOptions({ page: 1 }));
    return (
        <div>
            <GenerateQuiesHeader />
            {/* // Feedback Section */}
            <button className='group text-sm flex items-center my-6 px-4 md:px-12'>
                <div className='bg-blue-100 px-3 py-1.5 rounded text-black'>
                    <span>Check Feedback</span>
                    <ArrowRight className='group-hover:translate-x-0.5 transition size-5 inline-flex ml-1' />
                </div>
            </button>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div className='pt-24'><Loader /></div>}>
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

export default MockPage
