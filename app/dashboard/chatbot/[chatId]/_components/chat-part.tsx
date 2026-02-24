"use client"

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import EmptyState from '../../../interview/_components/empty-state'
import { useTRPC } from '@/trpc/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation';
import axios from 'axios'
import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import { ArrowDown } from 'lucide-react'
import { LoaderFive } from '@/components/ui/loader'

const ChatPart = () => {
    const taRef = useRef<HTMLTextAreaElement | null>(null)
    const [userInput, setUserInput] = useState("")
    const [loading, setLoading] = useState(false);
    const [messageList, setMessageList] = useState<{ speaker: string, text: string }[]>([
    ]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);
    const { chatId } = useParams();
    console.log(chatId);

    const trpc = useTRPC();
    const addMessage = useMutation(
        trpc.chatMessage.add.mutationOptions({})
    );

    const handleSend = async () => {
        if (!userInput.trim()) return;
        setLoading(true);
        setMessageList(prev => [...prev, { speaker: "user", text: userInput }]);
        setUserInput("");
        const result = await axios.post("/api/chatbot", {
            userInput,
        });
        console.log(result.data.response);
        setMessageList(prev => [...prev, { speaker: "agent", text: result.data.response }]);
        setLoading(false);

        // Save user message to DB
        await addMessage.mutateAsync({
            chatId: String(chatId),
            speaker: "user",
            text: userInput,
        });

        // Save agent message to DB
        await addMessage.mutateAsync({
            chatId: String(chatId),
            speaker: "agent",
            text: result.data.response,
        });
    }

    const resize = useCallback(() => {
        const el = taRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${el.scrollHeight}px`
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
        resize()

    }

    // Fetch messages for the chatId and render them here (not implemented in this snippet)
    const { data: chatData } = useSuspenseQuery(trpc.chatMessage.getByChatId.queryOptions({ chatId: String(chatId) }));

    useEffect(() => {
        if (chatData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMessageList(
                chatData.map(m => ({
                    speaker: m.speaker,
                    text: m.text,
                }))
            );
            setIsInitialLoading(false);
        }
    }, [chatData]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;
        const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
        setShowScrollDownBtn(!isAtBottom);
    }

    return (
        <div className='relative flex flex-col gap-4 mt-2 h-[75vh]'>
            <div className='flex-1 flex flex-col gap-2 p-4 overflow-auto no-scrollbar' ref={containerRef} onScroll={handleScroll}>
                {isInitialLoading ? (
                    <div className='flex-1 flex items-center justify-center'>
                        <LoaderFive text="Loading conversation..." />
                    </div>
                ) : messageList.length === 0 ? (
                    <div className='flex-1 flex items-center justify-center'>
                        <EmptyState title="Your Senior is ready for help!" />
                    </div>
                ) : (
                    messageList.map((message, index) => (
                        <div key={index} className={`flex ${message.speaker === "user" ? "justify-end" : "justify-start"} mb-2`}>
                            <div
                                className={`py-1 px-3 text-sm rounded-lg break-words border inline-block max-w-[90%] ${message.speaker === "user" ? "text-right" : "text-left"}`}>
                                <Markdown
                                    remarkPlugins={[remarkGfm]}
                                    skipHtml={false}
                                    components={{
                                        p: ({ children }) => (
                                            <p className="my-2 leading-relaxed text-sm text-zinc-800 dark:text-zinc-300">
                                                {children}
                                            </p>
                                        ),

                                        strong: ({ children }) => (
                                            <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                {children}
                                            </strong>
                                        ),

                                        ul: ({ children }) => (
                                            <ul className="list-disc pl-5 my-2 space-y-1">
                                                {children}
                                            </ul>
                                        ),

                                        li: ({ children }) => (
                                            <li className="text-sm text-zinc-800 dark:text-zinc-300">
                                                {children}
                                            </li>
                                        ),

                                        h1: ({ children }) => (
                                            <h1 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                                                {children}
                                            </h1>
                                        ),

                                        h2: ({ children }) => (
                                            <h2 className="text-md font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                                                {children}
                                            </h2>
                                        ),

                                        blockquote: ({ children }) => (
                                            <blockquote className="border-l-4 border-zinc-300 pl-3 italic text-zinc-600 dark:border-zinc-600 dark:text-zinc-400 my-2">
                                                {children}
                                            </blockquote>
                                        ),
                                    }}
                                >
                                    {message.text}
                                </Markdown>

                            </div>
                        </div>
                    ))
                )}
                {loading && <LoaderFive text="Thinking..." />}
                <div ref={bottomRef} />
            </div>
            <div className='flex items-end md:justify-between gap-4 bottom-0'>
                <Textarea
                    ref={taRef}
                    placeholder='Ask anything...'
                    onInput={handleInput}
                    className='min-h-[40px] max-h-[40vh] resize-none overflow-auto flex-1'
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <Button
                    variant="outline"
                    className='hover:cursor-pointer min-h-[40px]'
                    onClick={handleSend}
                    disabled={loading}
                >
                    <Send />
                    Send
                </Button>

            </div>
            {showScrollDownBtn && (
                <Button
                    onClick={() =>
                        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                    variant="outline"
                    className="absolute hover:cursor-pointer bottom-16 right-6 rounded text-xs shadow-md"
                >
                    <ArrowDown className='' />
                </Button>
            )}
        </div>
    )
}

export default ChatPart
