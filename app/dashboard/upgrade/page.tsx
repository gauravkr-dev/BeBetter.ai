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
                <Suspense fallback={<Loader />}>
                    <ErrorBoundary fallback={<div className='text-red-500'>Failed to load upgrade options. Please try again later.</div>}>
                        <UpgradeView />
                    </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </div>
    )
}

export default page
