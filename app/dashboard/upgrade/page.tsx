import React, { Suspense } from 'react'
import { FreeTrials } from './_components/free-trials'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import Loader from '@/components/Loader';
import { UpgradeView } from './_components/upgrade-view';
import { ErrorState } from '@/components/Error';

const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        redirect('/');
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.premium.getCurrentSubscription.queryOptions()
    )
    void queryClient.prefetchQuery(
        trpc.premium.getProducts.queryOptions()
    )
    return (
        <div>
            <FreeTrials />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<div className='pt-24'><Loader /></div>}>
                    <ErrorBoundary
                        fallback={
                            <div
                                className='px-4 md:px-12 text-center justify-center flex mt-24 text-red-500'>
                                <ErrorState />
                            </div>
                        }>
                        <UpgradeView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </div>
    )
}

export default page
