import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResumeUploadDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };

    return (
        <ResponsiveDialog
            title="Upload Resume"
            description="Upload your resume to get AI-powered feedback."
            open={open}
            onOpenChange={onOpenChange}
        >
            <FileUpload onChange={handleFileUpload} />
            <div className="mt-8 flex flex-row items-center justify-end gap-4 px-4 py-3">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:cursor-pointer">
                    Cancel
                </Button>
                <Button className="group cursor-pointer" disabled={files.length === 0}>
                    Let&apos;s Analyze
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </ResponsiveDialog>
    )
}