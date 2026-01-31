"use client"
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/optics/card";
import { User } from 'lucide-react';



const StartInterviewPart = () => {

    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());


    return (
        <div className="w-full flex flex-col items-start justify-center mt-4 px-4 md:px-12">
            <Card
                className="w-54 h-48 flex items-start dark:bg-[#121212] "
                decorations
            >
                <CardHeader className="w-full">
                    <CardTitle className="text-xl font-medium">
                        <User className='size-8 border border-primary rounded-full p-1' />
                        <p>{JSON.stringify(data)}</p>
                    </CardTitle>
                    <CardDescription className="text-sm">

                    </CardDescription>


                </CardHeader>
            </Card>
        </div>
    )
}

export default StartInterviewPart
