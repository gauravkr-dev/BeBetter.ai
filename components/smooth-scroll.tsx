"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            prevent: (node) => {
                return node.hasAttribute("data-lenis-prevent");
            },
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return null;
}