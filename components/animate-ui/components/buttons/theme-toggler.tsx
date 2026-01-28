'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';

import {
    ThemeToggler as ThemeTogglerPrimitive,
    type ThemeTogglerProps as ThemeTogglerPrimitiveProps,
    type ThemeSelection,
    type Resolved,
} from '@/components/animate-ui/primitives/effects/theme-toggler';

import { buttonVariants } from '@/components/animate-ui/components/buttons/icon';
import { cn } from '@/lib/utils';

/* ✅ icon logic simplified (NO system) */
const getIcon = (theme: ThemeSelection) => {
    return theme === 'dark' ? <Moon /> : <Sun />;
};

/* ✅ next theme logic simplified */
const getNextTheme = (theme: ThemeSelection): ThemeSelection => {
    return theme === 'dark' ? 'light' : 'dark';
};

type ThemeTogglerButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        onImmediateChange?: ThemeTogglerPrimitiveProps['onImmediateChange'];
        direction?: ThemeTogglerPrimitiveProps['direction'];
    };

function ThemeTogglerButton({
    variant = 'default',
    size = 'default',
    direction = 'ltr',
    onImmediateChange,
    onClick,
    className,
    ...props
}: ThemeTogglerButtonProps) {
    const { theme, setTheme, resolvedTheme } = useTheme();

    /* 🔥 MOST IMPORTANT FIX */
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <ThemeTogglerPrimitive
            theme={(theme ?? 'light') as ThemeSelection}
            resolvedTheme={(resolvedTheme ?? 'light') as Resolved}
            setTheme={setTheme}
            direction={direction}
            onImmediateChange={onImmediateChange}
        >
            {({ effective, toggleTheme }) => (
                <button
                    data-slot="theme-toggler-button"
                    className={cn(buttonVariants({ variant, size }), className)}
                    onClick={(e) => {
                        onClick?.(e);
                        toggleTheme(getNextTheme(effective));
                    }}
                    {...props}
                >
                    {getIcon(effective)}
                </button>
            )}
        </ThemeTogglerPrimitive>
    );
}

export { ThemeTogglerButton };
