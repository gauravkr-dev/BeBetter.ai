import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { agentsInsertSchema } from "@/modules/agents/schemas";
import { AgentGetOne } from "@/modules/agents/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useRouter } from "next/navigation";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({ onSuccess, onCancel, initialValues }: AgentFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions(),
                );
                if (initialValues?.id) {
                    await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                    );
                }
                toast.success(`Interview started with agent "${form.getValues("name")}"`);
                router.push(`/dashboard/interview/${data.id}`);
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to start interview");
            }
        })
    )

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: "",
            instructions: "",
        }
    })

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        createAgent.mutate(values);
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 px-2">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agent Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Python Expert" {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Agent Instruction</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter instruction for the agent" {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                <div className="flex justify-end mt-4 gap-2">
                    {onCancel && (
                        <Button variant="outline" type="button" onClick={onCancel} className="mr-2 hover:cursor-pointer">
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" className="hover:cursor-pointer">
                        Start Interview
                    </Button>
                </div>
            </form>
        </Form>
    )
}