import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DurationInputForm } from "./duration-input-form";



interface DurationInputDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (durationMinutes: string) => void;
}

export const DurationInputDialog = ({ open, onOpenChange, onSubmit }: DurationInputDialogProps) => {
    return (
        <ResponsiveDialog
            title="Set Interview Duration"
            description="Provide the duration for this interview session."
            open={open}
            onOpenChange={onOpenChange}
        >
            <DurationInputForm
                onSuccess={(durationMinutes) => {
                    onSubmit?.(durationMinutes);
                    onOpenChange(false);
                }}
                onCancel={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}