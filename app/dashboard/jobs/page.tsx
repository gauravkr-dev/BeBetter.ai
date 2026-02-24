import React, { Suspense } from 'react'
export const dynamic = 'force-dynamic';
import JobList from './_components/job-list'
import { LoaderFive } from '@/components/ui/loader';

const page = () => {
    return (
        <div>
            <Suspense fallback={<div className='pt-48 flex items-center justify-center'><LoaderFive text="Loading Jobs..." /></div>}>
                <JobList />
            </Suspense>
        </div>
    )
}

export default page
