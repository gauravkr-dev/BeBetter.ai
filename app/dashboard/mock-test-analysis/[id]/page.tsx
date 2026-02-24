import React, { Suspense } from 'react'
import { MockTestOverallFeedbackPart } from './_components/mock-test-overall-feedback-part'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import Loader from '@/components/Loader'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorState } from '@/components/Error'
import { getQueryClient, trpc } from '@/trpc/server'

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
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.mockTestOverallFeedback.getById.queryOptions({
        mockTestId: id,
    }));
    void queryClient.prefetchQuery(trpc.mockTestQuestions.getById.queryOptions({
        mockTestId: id,
    }));
    void queryClient.prefetchQuery(trpc.mockTestUserAnswer.getById.queryOptions({
        mockTestId: id,
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
                        <MockTestOverallFeedbackPart mockTestId={id} />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </div>
    )
}

export default page
