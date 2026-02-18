/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { startSpeechRecognition } from "./speech";
import { speak, stopSpeaking } from "@/lib/tts";
import { AiCallingPage } from "./_components/ai-calling-page";
import { authClient } from "@/lib/auth-client";
import { se } from "date-fns/locale";
import axios from "axios";
import { user } from "@/db/schema";


interface InterviewSessionProps {
    params: Promise<{ id: string }> | { id: string };
}

const InterviewSession = ({ params }: InterviewSessionProps) => {
    const router = useRouter();
    const trpc = useTRPC();
    const { data } = authClient.useSession();
    const resolvedParams = React.use(params as Promise<{ id: string }>);
    const { id } = resolvedParams;

    const [interimText, setInterimText] = useState("");
    const [agentText, setAgentText] = useState("");
    const [agentSpeaking, setAgentSpeaking] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);



    const recognitionRef = useRef<any>(null);
    const agentSpeakingRef = useRef(false);
    const seqRef = useRef(1);
    const endedRef = useRef(false);
    const { data: agent } = useSuspenseQuery(
        trpc.agents.getOne.queryOptions({ id: id }),
    );

    const updateAgent = useMutation(
        trpc.agents.update.mutationOptions({
            onSuccess: async () => {
                await trpc.agents.getOne.queryOptions({ id: id });
            },
            onError: (error) => {
                toast.error(error?.message || "Failed to update agent");
            }
        })
    );

    /* -------- mutations -------- */

    const addTranscript = useMutation(
        trpc.transcript.add.mutationOptions({})
    );



    const endInterview = async () => {
        // await axios.post("/api/interview-feedback", {
        //     agentId: agent?.id,
        // });
        (window as any).__forceStopSTT = true;
        recognitionRef.current?.stop();
        if (endedRef.current) return;

        endedRef.current = true;

        try {
            await updateAgent.mutateAsync({
                id: agent?.id,
                isInterviewCompleted: true,
            });
            router.push("/dashboard/interview");
        } catch (err) {
            toast.error("Failed to end interview");
        }
    };


    const toggleMute = () => {
        if (!recognitionRef.current) return;

        if (isMuted) {
            (window as any).__forceStopSTT = false;
            recognitionRef.current.start();
        } else {
            (window as any).__forceStopSTT = true;
            recognitionRef.current.stop();
        }

        setIsMuted(!isMuted);
    };


    /* -------- core voice loop -------- */

    const initSTT = () => {
        if (recognitionRef.current) return;

        const safeStart = () => {
            try {
                recognitionRef.current?.start();
            } catch (e) {
                // If start is called too quickly, try again shortly
                setTimeout(() => {
                    try {
                        recognitionRef.current?.start();
                    } catch (err) {
                        // ignore
                    }
                }, 250);
            }
        };

        const recognition = startSpeechRecognition(
            (interim) => {
                if (agentSpeakingRef.current) return;
                setInterimText(interim);
            },

            async (finalText) => {
                if (agentSpeakingRef.current) return;
                if (!finalText.trim()) return;

                setInterimText("");

                try {
                    // 1️⃣ save USER
                    await addTranscript.mutateAsync({
                        agentId: agent?.id,
                        speaker: "user",
                        text: finalText,
                        sequence: seqRef.current++,
                    });

                    // 2️⃣ stop mic BEFORE agent speaks
                    recognitionRef.current?.stop();
                    setIsThinking(true);
                    // 3️⃣ get agent reply

                    const res = await axios.post("/api/interview", {
                        userInput: finalText,
                        agentName: agent?.name || "Interviewer",
                        agentInstruction: agent?.instructions || "Be professional and courteous.",
                        agentId: agent?.id,
                    })



                    if (!res?.data?.response) {
                        safeStart();
                        return;
                    }
                    setIsThinking(false);
                    setAgentText(res.data.response);

                    // 5️⃣ speak agent + resume mic AFTER finish
                    agentSpeakingRef.current = true;
                    (window as any).__agentSpeaking = true;
                    setAgentSpeaking(true);

                    speak(res.data.response, () => {
                        agentSpeakingRef.current = false;
                        (window as any).__agentSpeaking = false;
                        setAgentSpeaking(false);
                        safeStart();
                    });

                    // 4️⃣ save AGENT
                    await addTranscript.mutateAsync({
                        agentId: agent?.id,
                        speaker: "agent",
                        text: res.data.response,
                        sequence: seqRef.current++,
                    });



                } catch (err) {
                    console.error(err);
                    toast.error("Agent reply failed");
                    setIsThinking(false);
                    safeStart();
                }
            }
        );

        recognitionRef.current = recognition;
    };

    /* -------- lifecycle -------- */

    useEffect(() => {
        if (!id) return;
        initSTT();
    }, [id]);


    return (
        <>
            {/* <h1 className="text-xl font-semibold">Interview Running…</h1> */}
            {/** determine which side should show loader */}
            <AiCallingPage
                agentName={agent?.name}
                userName={data?.user?.name ?? ""}
                userImageUrl={data?.user?.image ?? undefined}
                onEnd={endInterview}
                activeSpeaker={agentSpeaking ? "agent" : interimText ? "candidate" : null}
                agentText={agentText}
                interimText={interimText}
                isThinking={isThinking}
                isMuted={isMuted}
                onToggleMute={toggleMute}
            />
        </>
    );
};

export default InterviewSession;
