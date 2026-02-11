import { ResponsiveDialog } from "@/components/responsive-dialog";
import { ChatUpdateForm } from "./chat-update-form";
import { ChatGetOne } from "@/modules/chatbot/server/chat/types";

interface UpdateChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues?: ChatGetOne;
}

export const UpdateChatDialog = ({ open, onOpenChange, initialValues }: UpdateChatDialogProps) => {
    return (
        <ResponsiveDialog
            title="Update Chat Title"
            description="Provide a new name for this chat session."
            open={open}
            onOpenChange={onOpenChange}
        >
            <ChatUpdateForm
                initialValues={initialValues}
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}