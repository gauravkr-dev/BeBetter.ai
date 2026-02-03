import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react"

interface AgentDeleteUpdateDialogProps {
    onEdit?: () => void;
    onRemove?: () => void;
    className?: string;
}
export const AgentDeleteUpdateDialog = ({ onEdit, onRemove, className }: AgentDeleteUpdateDialogProps) => {
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