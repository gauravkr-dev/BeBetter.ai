"use client"
import { CircuitBoard } from "@/components/animate-ui/icons/circuit-board"
import { AnimateIcon } from "@/components/animate-ui/icons/icon"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

interface EmptyStateProps {
    title: string
    description: string
}
export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <AnimateIcon animateOnHover>
                        <CircuitBoard />
                    </AnimateIcon>
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>
                    {description}
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}
