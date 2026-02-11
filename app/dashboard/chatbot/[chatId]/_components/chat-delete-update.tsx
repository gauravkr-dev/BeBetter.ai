import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react"

interface ChatDeleteUpdateDialogProps {
    onEdit?: () => void;
    onRemove?: () => void;
    className?: string;
}
export const ChatDeleteUpdateDialog = ({ onEdit, onRemove, className }: ChatDeleteUpdateDialogProps) => {
    return (
        <div className={className}>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <MoreVerticalIcon className="size-4 hover:cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {onEdit && (
                        <DropdownMenuItem onClick={onEdit}>
                            <PencilIcon />
                            Edit
                        </DropdownMenuItem>
                    )}
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