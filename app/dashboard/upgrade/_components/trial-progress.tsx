
interface TrialProgressProps {
    usage: number;
    total: number;
    title: string;
}

export const TrialProgress = ({ usage, total, title }: TrialProgressProps) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = usage / total;
    const strokeDashoffset = circumference * (1 - progress);
    return (
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
                <span className=" text-sm text-center"><span className="font-semibold">{`${usage}/${total}`}</span> <br /> <span>{title}</span></span>
            </div>
        </div>
    )
}