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
import { speakWithSarvam, stopSarvam } from "@/lib/sarvam-tts";
import { AiCallingPage } from "./_components/ai-calling-page";
import { authClient } from "@/lib/auth-client";
import axios from "axios";

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
    const [followupCount, setFollowupCount] = useState(0);
    const followupRef = useRef(0);
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

        endedRef.current = true;

        (window as any).__forceStopSTT = true;
        (window as any).__micLocked = true;

        recognitionRef.current?.stop();
        stopSarvam();   // 🔥 IMPORTANT

        try {
            await updateAgent.mutateAsync({
                id: agent?.id,
                isInterviewCompleted: true,
            });

            await axios.post("/api/interview-feedback", {
                agentId: agent?.id,
                userId: agent?.userId,
            })
            router.push(`/dashboard/interview-analysis/${agent?.id}`);
        } catch (err) {
            toast.error("Failed to end interview");
        }
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

                    // Increase followup count immediately when user text is sent
                    followupRef.current = followupRef.current + 1;
                    setFollowupCount(followupRef.current);

                    // 2️⃣ stop mic BEFORE agent speaks
                    (window as any).__forceStopSTT = true;
                    (window as any).__micLocked = true;

                    recognitionRef.current?.stop();
                    setIsThinking(true);
                    // 3️⃣ get agent reply

                    const res = await axios.post("/api/interview", {
                        agentName: agent?.name || "Interviewer",
                        agentInstruction: agent?.instructions || "Be professional and courteous.",
                        agentId: agent?.id,
                        followupCount: followupRef.current,
                    })
                    console.log("followupCount", followupRef.current);
                    if (endedRef.current) return;

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

                    speakWithSarvam(res.data.response, () => {
                        agentSpeakingRef.current = false;
                        (window as any).__agentSpeaking = false;
                        setAgentSpeaking(false);

                        // 🔥 UNLOCK MIC
                        (window as any).__forceStopSTT = false;
                        (window as any).__micLocked = false;

                        try {
                            recognitionRef.current?.start();
                        } catch { }
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
            />
        </>
    );
};

export default InterviewSession;
