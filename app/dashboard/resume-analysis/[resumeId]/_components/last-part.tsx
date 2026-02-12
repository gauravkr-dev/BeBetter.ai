import { BadgeAlert, BadgeCheck, BadgePlus } from 'lucide-react'
interface LastPartProps {
    tips_for_improvement: string[];
    whats_good: string[];
    needs_improvement: string[];
}

export const LastPart = ({ tips_for_improvement, whats_good, needs_improvement }: LastPartProps) => {
    return (
        <section className="py-6 md:py-12">
            <div className="space-y-8 px-6 md:space-y-16">

                <div className="relative mx-auto flex flex-col divide-x divide-y border *:p-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-5">
                            <BadgeCheck className="size-6 text-green-500" />
                            <h3 className="text-lg font-medium">Positive Indices</h3>
                        </div>
                        <ol className="list-decimal list-inside">
                            {whats_good?.map((item, i) => (

                                <li key={i} className="text-sm mb-3">
                                    {item}
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-5">
                            <BadgeAlert className="size-6 text-yellow-500" />
                            <h3 className="text-lg font-medium">Risk Factors</h3>
                        </div>
                        <ol className="list-decimal list-inside">
                            {needs_improvement?.map((item, i) => (
                                <li key={i} className="text-sm mb-3">
                                    {item}
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2  mb-5">
                            <BadgePlus className="size-6 text-blue-500" />

                            <h3 className="text-lg font-medium">Recommendations</h3>
                        </div>
                        <ol className="list-decimal list-inside">
                            {tips_for_improvement?.map((item, i) => (
                                <li key={i} className="text-sm mb-3">
                                    {item}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    )
}