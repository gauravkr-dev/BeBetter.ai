"use client";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { authClient } from "@/lib/auth-client";
import AnalysisLoader from "@/components/analysis-loader";

interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResumeUploadDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
    const { data } = authClient.useSession();
    const router = useRouter();
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const id = uuidv4();
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
    };


    const onSubmit = async () => {
        setLoading(true);
        if (files.length === 0) {
            setLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("file", files[0]);
        // include userId so the server can save which user uploaded the resume
        formData.append("userId", data?.user?.id || "user-123");
        formData.append("fileName", files[0].name);
        formData.append("fileType", files[0].type);
        formData.append("fileSize", files[0].size.toString());
        formData.append("id", id);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await axios.post("/api/upload-resume", formData);
        onOpenChange(false);
        setLoading(false);
        router.push(`/dashboard/resume-analysis/${id}`);
    }

    return (
        <ResponsiveDialog
            title="Upload Resume"
            description="Upload your resume to get AI-powered feedback."
            open={open}
            onOpenChange={onOpenChange}
        >
            {loading ? (
                <AnalysisLoader />
            ) : (
                <>
                    <FileUpload onChange={handleFileUpload} />
                    <div className="mt-8 flex flex-row items-center justify-end gap-4 px-4 py-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="hover:cursor-pointer">
                            Cancel
                        </Button>
                        <Button
                            className="group cursor-pointer"
                            disabled={files.length === 0} onClick={onSubmit} >
                            Let&apos;s Analyze
                            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </>
            )}
        </ResponsiveDialog>
    )
}