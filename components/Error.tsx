import { BadgeAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface ErrorProps {
    className?: string;
}

export const ErrorState = ({ className }: ErrorProps) => {
    return (
        <Alert className={`max-w-max flex flex-col items-start justify-center border-destructive/80 dark:bg-[#171717] text-destructive ${className}`}>
            <AlertTitle className="flex flex-row gap-2 items-center">
                <BadgeAlert className="size-4" />
                Error
            </AlertTitle>
            <AlertDescription className="text-destructive/80 ml-6">
                There was a problem processing your request. Please try again.
            </AlertDescription>
        </Alert>
    )
}