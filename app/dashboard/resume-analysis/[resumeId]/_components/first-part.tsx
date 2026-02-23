
import { ArrowRight } from "lucide-react";

interface FirstPartProps {
    overall_score: number;
    overall_feedback: string;
    summary_comment: string;
}

export const FirstPart = ({ overall_score, overall_feedback, summary_comment }: FirstPartProps) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = overall_score / 100;
    const strokeDashoffset = circumference * (1 - progress);
    return (

        <div className=" md:px-6 py-4 px-4 border flex flex-col mb-4">
            <div className="group text-lg font-medium flex items-center mb-4">
                <span>Overall Feedback</span>
                <ArrowRight className="inline-block ml-2 size-5 group-hover:translate-x-2 transition-transform" />
            </div>

            <div className="flex items-center flex-col md:flex-row w-full gap-12 justify-center">
                <div className="relative w-[160px] h-[160px] w-1/3">
                    <svg
                        height="100%"
                        width="100%"
                        viewBox="0 0 100 100"
                        className="transform -rotate-90"
                    >
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={normalizedRadius}
                            stroke="#e5e7eb"
                            strokeWidth={stroke}
                            fill="transparent"
                        />
                        {/* Partial circle with gradient */}
                        <defs>
                            <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF97AD" />
                                <stop offset="100%" stopColor="#5171FF" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="50"
                            cy="50"
                            r={normalizedRadius}
                            stroke="url(#grad)"
                            strokeWidth={stroke}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Score and issues */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-semibold text-sm">{`${overall_score}/100`}</span>
                    </div>
                </div>
                <div className="w-full md:w-2/3 flex flex-col justify-center space-y-2">
                    <p className="text-2xl font-medium font-serif">{overall_feedback}</p>
                    <p className="text-sm  mt-2 ">{summary_comment}</p>
                </div>
            </div>
            {/* <p className="text-sm text-muted-foreground mt-2">{overall_feedback}</p>
                <p className="text-sm text-muted-foreground mt-2">{summary_comment}</p> */}
        </div>

    );
};