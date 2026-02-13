import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import GenerateLoader from '../../../../components/generate-loader';
import { v4 as uuidv4 } from 'uuid';
import { authClient } from "@/lib/auth-client";

interface GenerateQuiesFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}


export const GenerateQuiesForm = ({ onSuccess, onCancel }: GenerateQuiesFormProps) => {
    const id = uuidv4();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data } = authClient.useSession();
    const GenerateQuiesFormValues = z.object({
        questionCount: z.string().min(1, "At least 1 question is required").max(25, "Maximum 25 questions are allowed."),
        describe_topics: z.string().min(4, "Description should be at least 4 characters long").max(1000, "Description should be less than 1000 characters."),
        questions_level: z.string().min(4, "Questions level should be at least 4 characters long").max(1000, "Questions level should be less than 1000 characters."),
    })

    const form = useForm<z.infer<typeof GenerateQuiesFormValues>>({
        resolver: zodResolver(GenerateQuiesFormValues),
        defaultValues: {
            questionCount: "",
            describe_topics: "",
            questions_level: "",
        }
    })


    const onSubmit = async (values: z.infer<typeof GenerateQuiesFormValues>) => {
        setLoading(true);
        // Api Call to generate quies 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await axios.post("/api/generate-quies", {
            userInput: values,
            id: id,
            userId: data?.user?.id,
        });
        router.push(`/dashboard/mock-test/${id}`);
        toast.success("Mock test generated successfully!");
        onSuccess?.();
        setLoading(false);
    }
    return (
        <>
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <GenerateLoader />
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 px-2">
                        <FormField
                            name="questionCount"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>No of Questions(1-25)</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} max={25} placeholder="Enter number of questions" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            name="describe_topics"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Describe Topics</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter description of the topics" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            name="questions_level"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Questions Level</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter questions level" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <div className="flex justify-end mt-4 gap-2">
                            {onCancel && (
                                <Button variant="outline" type="button" onClick={onCancel} className="mr-2 hover:cursor-pointer">
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" className="hover:cursor-pointer" disabled={loading}>
                                Start Practice
                            </Button>
                        </div>
                    </form>
                </Form>

            )
            }

        </>
    )
}