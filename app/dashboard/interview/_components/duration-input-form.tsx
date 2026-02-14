"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface DurationInputFormProps {
    onSuccess?: (durationMinutes: string) => void;
    onCancel: () => void;
}

export const DurationInputForm = ({ onSuccess, onCancel }: DurationInputFormProps) => {
    const [submitting, setSubmitting] = useState(false);

    const durationSchema = z.object({
        durationMinutes: z.string().regex(/^\d+$/, "Duration must be a positive integer").refine(s => {
            const n = Number(s);
            return n >= 10 && n <= 180;
        }, "Duration must be between 10 and 180 minutes"),
    })
    const form = useForm({
        resolver: zodResolver(durationSchema),
        defaultValues: {
            durationMinutes: "",
        }
    })

    const handleSubmit = (data: z.infer<typeof durationSchema>) => {
        onSuccess?.(data.durationMinutes.toString());
        console.log("Submitted duration:", data.durationMinutes);
        setSubmitting(true);
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    name="durationMinutes"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 60" type="number" {...field} />
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