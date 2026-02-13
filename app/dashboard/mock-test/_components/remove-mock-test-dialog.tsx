import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon, TrashIcon } from "lucide-react"

interface RemoveMockTestDialogProps {
    onRemove?: () => void;
    className?: string;
}
export const RemoveMockTestDialog = ({ onRemove, className }: RemoveMockTestDialogProps) => {
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