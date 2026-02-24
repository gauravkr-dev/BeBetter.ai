import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/')
    }
    return (
        <div className="md:px-8 px-4 my-6">
            <section className="w-full">
                <div className="container mx-auto px-6 border rounded py-6 dark:bg-[#121212]">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Left Side - Content */}
                        <div className="space-y-6">

                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                The Work You Do Today Changes Everything.
                            </h2>

                            <p className="text-muted-foreground leading-relaxed">
                                Success isn’t about luck. It’s about showing up every single day,
                                improving a little more than yesterday, and refusing to quit when
                                things feel difficult.
                            </p>

                            <p className="text-muted-foreground leading-relaxed">
                                Every small effort compounds. Every attempt builds confidence.
                                Keep going — your breakthrough might be closer than you think.
                            </p>

                            <ul className="space-y-4 pt-4">
                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    <p className="text-muted-foreground">
                                        Stay consistent even when progress feels slow
                                    </p>
                                </li>

                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    <p className="text-muted-foreground">
                                        Small improvements lead to big transformations
                                    </p>
                                </li>

                                <li className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    <p className="text-muted-foreground">
                                        Discipline today creates freedom tomorrow
                                    </p>
                                </li>
                            </ul>

                            {/* CTA */}

                        </div>

                        {/* Right Side - Image */}
                        <div className="relative flex justify-center">
                            <div className="relative w-full max-w-md aspect-square rounded-2xl flex items-center justify-center">
                                <Image
                                    src="/dashboard-image.svg"
                                    alt="Motivational Illustration"
                                    fill
                                    className="object-contain p-6"
                                />
                            </div>
                        </div>

                    </div>
                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        <div className='flex flex-col gap-6'>
                            <Link href="/dashboard/interview" className="group " >
                                <Button className="w-full cursor-pointer" variant="outline"
                                >
                                    Start Interview
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/dashboard/mock-test" className="group " >
                                <Button className="w-full cursor-pointer" variant="outline"
                                >
                                    Start Mock Test
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                        <div className='flex flex-col gap-6 '>
                            <Link href="/dashboard/resume-analysis" className="group" >
                                <Button className="w-full cursor-pointer" variant="outline"
                                >
                                    Analyse Your Resume
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/dashboard/jobs" className="group " >
                                <Button className="w-full cursor-pointer" variant="outline"
                                >
                                    Explore Jobs
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )
}

export default page
