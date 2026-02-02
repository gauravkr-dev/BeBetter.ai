"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle } from "@/components/optics/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Loader from "./speaker-ui";


interface AiCallingPageProps {
    agentName: string;
    userName: string;
    userImageUrl?: string;
    remainingMs?: number;
    onEnd?: () => void;
    activeSpeaker?: "agent" | "candidate" | null;
    agentText?: string;
    interimText?: string;
}


export const AiCallingPage = ({ agentName, userName, userImageUrl, remainingMs, onEnd, activeSpeaker, agentText, interimText }: AiCallingPageProps) => {
    const formatRemaining = (ms: number) => {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };
    return (
        <div className="flex flex-col items-center justify-center gap-8 mt-4 px-4 md:px-12">
            <Card
                className="relative w-full flex flex-col items-center justify-center dark:bg-[#121212] px-4 py-6"
                decorations
            >
                {remainingMs != null && (
                    <div className="absolute top-3 right-3 bg-white/80 dark:bg-black/60 text-sm text-muted-foreground px-3 py-1 rounded-full shadow">
                        {formatRemaining(remainingMs)}
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-semibold text-center">In Call</h3>
                </div>
                <p className="text-center text-sm">You are connected --- speak when ready</p>
                <div className="w-full flex flex-col md:flex-row items-center justify-around gap-8 mt-1">
                    <CardHeader className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-2">
                        <CardTitle className="text-xl font-medium">
                            <div className='border font-medium flex flex-col items-center justify-center border-primary rounded-full flex-shrink-0 h-12 w-12'>
                                {agentName.charAt(0).toUpperCase()}
                            </div>
                        </CardTitle>
                        <p className="text-sm text-center truncate font-semibold">
                            {agentName}
                        </p>
                        <p className="text-sm text-center">Interviewer</p>
                        <div className="absolute bottom-3 left-3">
                            {/** show loader on agent side when agent is speaking */}
                            {activeSpeaker === "agent" && <Loader />}
                        </div>
                    </CardHeader>

                    <div className="w-20 h-px md:h-20 md:w-px bg-gray-200 dark:bg-gray-700" aria-hidden></div>

                    <CardHeader className="w-1/2 flex flex-col items-center justify-center space-y-2">
                        <CardTitle className="text-xl font-medium">
                            {userImageUrl ? (
                                <Image src={userImageUrl} alt={userName} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                            ) : (
                                <div className='border font-medium flex flex-col items-center justify-center border-primary rounded-full flex-shrink-0 h-12 w-12'>
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </CardTitle>

                        <p className="text-sm text-center truncate font-semibold">
                            {userName}
                        </p>
                        <p className="text-sm text-center">Candidate</p>
                        <div className="absolute bottom-3 right-3">
                            {/** show loader on candidate side when candidate is speaking */}
                            {activeSpeaker === "candidate" && <Loader />}
                        </div>
                    </CardHeader>
                </div>

                <div className="w-full mt-4 flex justify-center">
                    <Button
                        className="px-2 py-1 bg-red-600 text-sm text-white rounded hover:bg-red-700 flex items-center gap-2"
                        onClick={() => onEnd?.()}
                    >
                        <Phone className="size-4" />
                        End
                    </Button>
                </div>
            </Card >

            {/* Transcript UI (moved from session page) */}

            <div className="w-full">
                <div className="dark:bg-[#121212] border rounded p-4 h-32 overflow-y-auto">
                    <div className="flex flex-col">
                        {!agentText && !interimText ? (
                            <p className="text-sm text-center text-muted-foreground my-10">Transcript will appear here as the call progresses.</p>
                        ) : null}
                        <div className="flex w-full gap-4 flex-col">
                            {/* Agent (left) */}
                            <div className="">
                                {agentText ? (
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full border flex items-center justify-center font-medium text-lg text-primary">
                                                {(agentName ?? "A").charAt(0).toUpperCase()
                                                }
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-2 text-xs font-medium">{agentText}</div>
                                    </div>
                                ) : null}
                            </div>

                            {/* Candidate / Interim (left-aligned) */}
                            <div className="">
                                {interimText ? (
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {userImageUrl ? (
                                                <Image src={userImageUrl} alt={userName ?? "User"} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                                            ) : (
                                                <div className='h-8 w-8 rounded-full border flex items-center justify-center font-medium'>
                                                    {(userName ?? "U").charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="border rounded-lg p-2 text-xs font-medium max-w-full">
                                            {interimText}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >


    )
}