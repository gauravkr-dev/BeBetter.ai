"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface ChatTitleFormProps {
    onSuccess?: (title: string) => void;
    onCancel: () => void;
}

export const ChatTitleForm = ({ onSuccess, onCancel }: ChatTitleFormProps) => {
    const [submitting, setSubmitting] = useState(false);

    const titleSchema = z.object({
        title: z.string().optional(),
    })
    const form = useForm({
        resolver: zodResolver(titleSchema),
        defaultValues: {
            title: "",
        }
    })

    const handleSubmit = (data: z.infer<typeof titleSchema>) => {
        onSuccess?.(data.title ?? "");
        console.log("Submitted title:", data.title);
        setSubmitting(true);
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Give this chat a name (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Nextjs app router" {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                <div className="flex justify-end mt-4 gap-2">
                    {onCancel && (
                        <Button variant="outline" disabled={submitting} type="button" onClick={onCancel} className="mr-2 hover:cursor-pointer">
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={submitting} className="hover:cursor-pointer">
                        {submitting ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}