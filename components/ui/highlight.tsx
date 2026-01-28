/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type HighlightContextValue = {
    activeId: string | null;
    setActiveId: (id: string | null) => void;
};

const HighlightContext = React.createContext<HighlightContextValue | null>(null);

type HighlightProps = {
    children: React.ReactNode;
    enabled?: boolean;
    hover?: boolean;
    controlledItems?: boolean;
    mode?: "parent" | "item";
    containerClassName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition?: any;
    forceUpdateBounds?: boolean;
};

export function Highlight({
    children,
    enabled = true,
    containerClassName,
}: HighlightProps) {
    const [activeId, setActiveId] = React.useState<string | null>(null);

    if (!enabled) {
        return <>{children}</>;
    }

    return (
        <HighlightContext.Provider value={{ activeId, setActiveId }}>
            <div className={cn("relative", containerClassName)}>
                {children}
            </div>
        </HighlightContext.Provider>
    );
}

type HighlightItemProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
    activeClassName?: string;
};

export function HighlightItem({
    children,
    activeClassName,
}: HighlightItemProps) {
    const ctx = React.useContext(HighlightContext);

    if (!ctx) return children;

    const id = React.useId();
    const isActive = ctx.activeId === id;

    return React.cloneElement(children, {
        "data-highlight": isActive || undefined,
        onMouseEnter: () => ctx.setActiveId(id),
        onMouseLeave: () => ctx.setActiveId(null),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        className: cn((children.props as any).className, isActive && activeClassName),
    });
}
