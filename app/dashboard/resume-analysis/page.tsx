import React, { Suspense } from 'react'
import { ResumeHeader } from './_components/resume-header'
import { ResumeList } from './_components/resume-analysis-list'
import { ArrowRight } from 'lucide-react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import Loader from '@/components/Loader'
import { ErrorBoundary } from 'react-error-boundary'
import { getQueryClient, trpc } from '@/trpc/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ErrorState } from '@/components/Error'

const page = async () => {
    // Check authentication
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.resume.getMany.queryOptions());
    return (
        <div>
            <ResumeHeader />
            {/* Analysis Resume List */}
            <button className='group text-sm flex items-center mt-6 px-4 md:px-12'>
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
                                className='mt-4 px-4 md:px-12 text-center justify-center flex mt-24 text-red-500'>
                                <ErrorState />
                            </div>
                        }>
                        <ResumeList />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>

        </div>
    )
}

export default page
