import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ReactNode } from 'react'
interface MiddlePartProps {
    communication_skills: { score: number; comment: string }
    technical_knowledge: { score: number; comment: string }
    problem_solving: { score: number; comment: string }
    confidence_clarity: { score: number; comment: string }
}


export const MiddlePart = ({ communication_skills, technical_knowledge, problem_solving, confidence_clarity }: MiddlePartProps) => {
    return (
        <section className="bg-zinc-50 py-6 md:py-8 dark:bg-transparent">
            <div className="@container mx-auto">
                <div className="md:grid-cols-2 grid-cols-1 grid gap-8">

                    <Card className="group shadow-none rounded-none">
                        <CardHeader className="">
                            <CardDecorator>
                                <span className='font-medium'>{communication_skills.score}%</span>
                            </CardDecorator>

                            <h3 className="font-medium text-center">Communication Skills</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">{communication_skills.comment}</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-none rounded-none">
                        <CardHeader className="">
                            <CardDecorator>
                                <span className='font-medium'>{technical_knowledge.score}%</span>
                            </CardDecorator>

                            <h3 className="font-medium text-center">Technical Knowledge</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">{technical_knowledge.comment}</p>
                        </CardContent>
                    </Card>
                    <Card className="group shadow-none rounded-none">
                        <CardHeader className="">
                            <CardDecorator>
                                <span className='font-medium'>{problem_solving.score}%</span>
                            </CardDecorator>

                            <h3 className="font-medium text-center">Problem Solving</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">{problem_solving.comment}</p>
                        </CardContent>
                    </Card>
                    <Card className="group shadow-none rounded-none">
                        <CardHeader className="">
                            <CardDecorator>
                                <span className='font-medium'>{confidence_clarity.score}%</span>
                            </CardDecorator>

                            <h3 className="font-medium text-center">Confidence & Clarity</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">{confidence_clarity.comment}</p>
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