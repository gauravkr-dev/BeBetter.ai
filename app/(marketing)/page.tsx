import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import { CtaSection } from './_components/home-section'
import { Navbar } from './_components/navbar'
import FooterSection from './_components/footer'
import Pricing from './_components/price'
import AboutSection from './_components/about-section'
import { FeaturesSection } from './_components/features-section'
import SmoothScroll from '@/components/smooth-scroll'



const page = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        redirect('/dashboard/interview');
    }
    return (
        <div className="max-w-screen mx-auto">
            <SmoothScroll />
            <Navbar />
            <CtaSection />
            <FeaturesSection />
            <AboutSection />
            <Pricing />
            <FooterSection />
        </div>
    )
}

export default page
