"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChatGetOne } from "@/modules/chatbot/server/chat/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface ChatUpdateFormProps {
    onSuccess?: () => void;
    onCancel: () => void;
    initialValues?: ChatGetOne;
}

export const ChatUpdateForm = ({ onSuccess, onCancel, initialValues }: ChatUpdateFormProps) => {
    const [submitting, setSubmitting] = useState(false);
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const updateChatTitle = useMutation(
        trpc.chat.update.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.chat.list.queryOptions(),
                );
                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.chat.getById.queryOptions({ chatId: initialValues.id }),
                    );
                }
                setSubmitting(false);
                toast.success(`Chat title updated successfully.`);
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error?.message || `Failed to update chat title.`);
                setSubmitting(false);
            }
        })
    )


    const titleSchema = z.object({
        title: z.string().optional(),
    })
    const form = useForm({
        resolver: zodResolver(titleSchema),
        defaultValues: {
            title: initialValues?.title ?? "",
        }
    })

    const handleSubmit = (data: z.infer<typeof titleSchema>) => {
        if (!initialValues?.id) return;
        updateChatTitle.mutate({ ...data, chatId: initialValues.id });
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
                            <FormLabel>Change Chat Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                        {submitting ? "Updating..." : "Update"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}