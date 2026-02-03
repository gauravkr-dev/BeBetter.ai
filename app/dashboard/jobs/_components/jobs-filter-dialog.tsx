import { ResponsiveDialog } from "@/components/responsive-dialog";
import { JobsFilterForm } from "./jobs-filter-form";


interface JobsFilterDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const JobsFilterDialog = ({ open, onOpenChange }: JobsFilterDialogProps) => {
    return (
        <ResponsiveDialog
            title="Filter Jobs"
            description="Apply filters to narrow down job listings."
            open={open}
            onOpenChange={onOpenChange}
        >
            <JobsFilterForm
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)} />
        </ResponsiveDialog>
    )
}