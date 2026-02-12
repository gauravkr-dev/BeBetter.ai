import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon, TrashIcon } from "lucide-react"

interface ResumeDeleteDialogProps {
    onRemove?: () => void;
    className?: string;
}
export const ResumeDeleteDialog = ({ onRemove, className }: ResumeDeleteDialogProps) => {
    return (
        <div className={className}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <MoreVerticalIcon className="size-4 hover:cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {onRemove && (
                        <DropdownMenuItem onClick={onRemove}>
                            <TrashIcon />
                            Delete
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}