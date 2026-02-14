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
import { getInterviewSystemPrompt } from "@/lib/prompts/interviewSystemPrompt";
import { AiCallingPage } from "./_components/ai-calling-page";
import { authClient } from "@/lib/auth-client";
import { se } from "date-fns/locale";


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


    const recognitionRef = useRef<any>(null);
    const agentSpeakingRef = useRef(false);
    const seqRef = useRef(1);
    const endedRef = useRef(false);
    const [remainingMs, setRemainingMs] = useState<number | null>(null);

    const { data: session } = useSuspenseQuery(
        trpc.interview.getOne.queryOptions({ id: id }),
    );

    const { data: agent } = useSuspenseQuery(
        trpc.agents.getOne.queryOptions({ id: session?.agentId ?? "" }),
    );

    /* -------- mutations -------- */

    const addTranscript = useMutation(
        trpc.transcript.add.mutationOptions({})
    );

    const agentReply = useMutation(
        trpc.interview.agentReply.mutationOptions({})
    );

    const endSession = useMutation(
        trpc.interview.end.mutationOptions({
            onSuccess: () => {
                toast.success("Interview ended");
                router.push("/dashboard/interview");
            },
        })
    );

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
                        sessionId: session?.id ?? id,
                        speaker: "user",
                        text: finalText,
                        sequence: seqRef.current++,
                    });

                    // 2️⃣ stop mic BEFORE agent speaks
                    recognitionRef.current?.stop();
                    setIsThinking(true);
                    // 3️⃣ get agent reply
                    const res = await agentReply.mutateAsync({
                        sessionId: session?.id ?? id,
                        agentInstruction:
                            getInterviewSystemPrompt({
                                agentName: agent?.name || "Interviewer",
                                agentInstruction: agent?.instructions || "Be professional and courteous.",
                                userExperience: agent?.experience || undefined,
                            }),
                        userText: finalText,
                    });



                    if (!res?.agentText) {
                        safeStart();
                        return;
                    }
                    setIsThinking(false);
                    setAgentText(res.agentText);

                    // 5️⃣ speak agent + resume mic AFTER finish
                    agentSpeakingRef.current = true;
                    (window as any).__agentSpeaking = true;
                    setAgentSpeaking(true);

                    speak(res.agentText, () => {
                        agentSpeakingRef.current = false;
                        (window as any).__agentSpeaking = false;
                        setAgentSpeaking(false);
                        safeStart();
                    });

                    // 4️⃣ save AGENT
                    await addTranscript.mutateAsync({
                        sessionId: session?.id ?? id,
                        speaker: "agent",
                        text: res.agentText,
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

        // setup countdown timer based on session createdAt + duration
        let timerId: ReturnType<typeof setInterval> | null = null;
        if (session) {
            const duration = (session.durationMinutes ?? 60) * 60 * 1000;
            const createdAt = session.createdAt ? new Date(session.createdAt).getTime() : Date.now();
            const endAt = createdAt + duration;

            const tick = () => {
                const now = Date.now();
                const rem = Math.max(0, endAt - now);
                setRemainingMs(rem);

                if (rem <= 0 && !endedRef.current) {
                    endedRef.current = true;
                    (window as any).__forceStopSTT = true; // 🔥 ADD THIS
                    try {
                        recognitionRef.current?.stop();
                    } catch (e) {
                        // ignore
                    }
                    stopSpeaking();
                    endSession.mutate({ sessionId: id });
                }
            };

            tick();
            timerId = setInterval(tick, 1000);
        }

        return () => {
            if (timerId) clearInterval(timerId);
            (window as any).__forceStopSTT = true;
            recognitionRef.current?.stop();
            recognitionRef.current = null;
            stopSpeaking();
        };
    }, [id]);

    return (
        <>
            {/* <h1 className="text-xl font-semibold">Interview Running…</h1> */}
            {/** determine which side should show loader */}
            <AiCallingPage
                agentName={agent?.name}
                userName={data?.user?.name ?? ""}
                userImageUrl={data?.user?.image ?? undefined}
                remainingMs={remainingMs ?? undefined}
                onEnd={() => endSession.mutate({ sessionId: id })}
                activeSpeaker={agentSpeaking ? "agent" : interimText ? "candidate" : null}
                agentText={agentText}
                interimText={interimText}
                isThinking={isThinking}
            />
        </>
    );
};

export default InterviewSession;
