import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface GenerateQuiesFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}



export const GenerateQuiesForm = ({ onSuccess, onCancel }: GenerateQuiesFormProps) => {

    const GenerateQuiesFormValues = z.object({
        questionCount: z.string(),
        describe_topics: z.string(),
        experience: z.string().optional(),
    })

    const form = useForm<z.infer<typeof GenerateQuiesFormValues>>({
        resolver: zodResolver(GenerateQuiesFormValues),
        defaultValues: {
            questionCount: "",
            describe_topics: "",
            experience: "",
        }
    })


    const onSubmit = (values: z.infer<typeof GenerateQuiesFormValues>) => {
        console.log("Form values:", values);
        toast.success("Mock test generated successfully!");
        onSuccess?.();
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 px-2">
                <FormField
                    name="questionCount"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>No of Questions</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter number of questions" {...field} />
                            </FormControl>
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
                        </FormItem>
                    )} />
                <FormField
                    name="experience"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Experience (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter your experience level on the topics" {...field} />
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
                        Start Practice
                    </Button>
                </div>
            </form>
        </Form>
    )
}