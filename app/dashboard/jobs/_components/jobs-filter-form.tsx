import { CommandSelect } from "@/components/command-select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface JobsFilterFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const JobsFilterForm = ({ onSuccess, onCancel }: JobsFilterFormProps) => {

    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const filterone = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
    const filtertwo = ["India", "United States", "Canada", "United Kingdom", "Germany", "Australia"];
    const filterthree = ["Software Developer", "Web Developer", "Full Stack Developer", "Frontend Developer", "Backend Developer", "Mobile App Developer", "Software Engineer", "Data Scientist", "Product Manager", "UX Designer", "DevOps Engineer", "QA Engineer", "System Administrator", "Database Administrator", "Network Engineer", "Security Analyst", "Cloud Engineer", "AI/ML Engineer", "Game Developer", "Embedded Systems Engineer", "IT Support Specialist", "Technical Writer", "Business Analyst", "Scrum Master", "IT Project Manager", "Solutions Architect", "IT Consultant", "Data Engineer", "Big Data Engineer", "Site Reliability Engineer", "IT Auditor", "IT Trainer", "IT Sales Specialist", "IT Recruiter"];

    const filterSchema = z.object({
        employmentType: z.string().optional(),
        location: z.string().optional(),
        jobTitle: z.string().optional(),
    });

    const form = useForm({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            employmentType: "",
            location: "",
            jobTitle: "",
        }
    });

    const [employmentType, setEmploymentType] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [jobTitle, setJobTitle] = useState<string>("");

    const onSubmit = (values: z.infer<typeof filterSchema>) => {
        const what = [values.jobTitle, values.employmentType]
            .filter(Boolean)
            .join(" ");

        const params = new URLSearchParams({
            what,
            location: values.location || "India",
        });
        router.push(`/dashboard/jobs?${params.toString()}`);

        setSubmitting(false);
        onSuccess?.();
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 px-2">

                <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <FormControl>
                        <CommandSelect
                            options={filterone.map(filter => ({
                                id: filter,
                                value: filter,
                                children: (
                                    <div className="px-4">{filter}</div>
                                )
                            })) || []}
                            onSelect={(value) => {
                                setEmploymentType(value);
                                form.setValue("employmentType", value);
                            }}
                            value={employmentType}
                            placeholder="Select an employment type"
                        />
                    </FormControl>
                </FormItem>
                <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <CommandSelect
                            options={filtertwo.map(filter => ({
                                id: filter,
                                value: filter,
                                children: (
                                    <div className="px-4">{filter}</div>
                                )
                            })) || []}
                            onSelect={(value) => {
                                setLocation(value);
                                form.setValue("location", value);
                            }}
                            value={location}
                            placeholder="Select a location"
                        />
                    </FormControl>
                </FormItem>
                <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                        <CommandSelect
                            options={filterthree.map(filter => ({
                                id: filter,
                                value: filter,
                                children: (
                                    <div className="px-4">{filter}</div>
                                )
                            })) || []}
                            onSelect={(value) => {
                                setJobTitle(value);
                                form.setValue("jobTitle", value);
                            }}
                            value={jobTitle}
                            placeholder="Select a job title"
                        />
                    </FormControl>
                </FormItem>
                <div className="flex justify-end mt-4 gap-2">
                    {onCancel && (
                        <Button variant="outline" disabled={submitting} type="button" onClick={onCancel} className="mr-2 hover:cursor-pointer">
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={submitting} className="hover:cursor-pointer">
                        {submitting ? "Applying..." : "Apply Filters"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}