import React from 'react'
import { GenerateQuiesHeader } from './_components/generate-quies-header'
import { ArrowRight } from 'lucide-react'
import { CheckFeedbackPart } from './_components/check-feedback'

const MockPage = () => {
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
            <CheckFeedbackPart />
        </div>
    )
}

export default MockPage
