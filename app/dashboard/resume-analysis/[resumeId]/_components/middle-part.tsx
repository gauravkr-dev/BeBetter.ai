import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ReactNode } from 'react'
interface MiddlePartProps {
    contact_info: { score: number; comment: string }
    experience: { score: number; comment: string }
    education: { score: number; comment: string }
    skills: { score: number; comment: string }
}


export const MiddlePart = ({ contact_info, experience, education, skills }: MiddlePartProps) => {
    return (
        <section className="bg-zinc-50 py-6 md:py-8 dark:bg-transparent">
            <div className="@container mx-auto px-6">
                <div className="md:grid-cols-2 grid-cols-1 grid gap-8">

                    <Card className="group shadow-none rounded-none">
                        <CardHeader className="">
                            <CardDecorator>
                                <span className='font-medium'>{experience.score}%</span>
                            </CardDecorator>

                            <h3 className="font-medium text-center">Career Utility</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">{experience.comment}</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-none rounded-none">
                        <CardHeader className="">
                            <CardDecorator>
                                <span className='font-medium'>{education.score}%</span>
                            </CardDecorator>

                            <h3 className="font-medium text-center">Academic Data</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">{education.comment}</p>
                        </CardContent>
                    </Card>
                    <Card className="group shadow-none rounded-none">
                        <CardHeader className="">
                            <CardDecorator>
                                <span className='font-medium'>{skills.score}%</span>
                            </CardDecorator>

                            <h3 className="font-medium text-center">Technical Map</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">{skills.comment}</p>
                        </CardContent>
                    </Card>
                    <Card className="group shadow-none rounded-none">
                        <CardHeader className="">
                            <CardDecorator>
                                <span className='font-medium'>{contact_info.score}%</span>
                            </CardDecorator>

                            <h3 className="font-medium text-center">Contact Layer</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">{contact_info.comment}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)