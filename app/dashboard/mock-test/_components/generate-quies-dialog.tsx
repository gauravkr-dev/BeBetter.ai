import { ResponsiveDialog } from "@/components/responsive-dialog";
import { GenerateQuiesForm } from "./generate-quies-form";

interface GenerateQuiesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const GenerateQuiesDialog = ({ open, onOpenChange }: GenerateQuiesDialogProps) => {
    return (
        <ResponsiveDialog
            title="Generate Mock Test"
            description="Create AI-powered mock tests instantly to practice and improve your skills."
            open={open}
            onOpenChange={onOpenChange}
        >
            <GenerateQuiesForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)} />
        </ResponsiveDialog>
    )
}