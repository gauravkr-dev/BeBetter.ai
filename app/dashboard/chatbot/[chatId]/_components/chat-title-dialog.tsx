import { ResponsiveDialog } from "@/components/responsive-dialog";
import { ChatTitleForm } from "./chat-title-form";



interface ChatTitleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (title: string) => void;
}

export const ChatTitleDialog = ({ open, onOpenChange, onSubmit }: ChatTitleDialogProps) => {
    return (
        <ResponsiveDialog
            title="Give this chat a name"
            description="Provide a name for this chat session."
            open={open}
            onOpenChange={onOpenChange}
        >
            <ChatTitleForm
                onSuccess={(title) => {
                    onSubmit?.(title);
                    onOpenChange(false);
                }}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}