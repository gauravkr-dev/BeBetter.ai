import React, { Suspense } from 'react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { InterviewFeedbackPart } from './_components/interview-feedback-part'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import Loader from '@/components/Loader'
import { getQueryClient, trpc } from '@/trpc/server'
import { ErrorState } from '@/components/Error'

interface Props {
    params: Promise<{ id: string }>
}

const page = async ({ params }: Props) => {
    const { id } = await params
    // Check authentication
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }
    console.log("Prefetching interview feedback for agentId:", id);
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.interviewFeedback.getById.queryOptions({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        agentId: id as any,
    }));
    return (
        <div className='px-4 md:px-12 py-6'>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div className='pt-48'><Loader /></div>}>
                    <ErrorBoundary
                        fallback={
                            <div
                                className='px-4 md:px-12 text-center justify-center flex mt-48 text-red-500'>
                                <ErrorState />
                            </div>
                        }>
                        <InterviewFeedbackPart agentId={id} />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </div>
    )
}

export default page
