import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import { CtaSection } from './_components/home-section'
import { Navbar } from './_components/navbar'



const page = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        redirect('/dashboard')
    }
    return (
        <div>
            <Navbar />
            <CtaSection />
        </div>
    )
}

export default page
