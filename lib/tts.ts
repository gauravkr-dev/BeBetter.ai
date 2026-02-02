/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// tts.ts
let currentUtterance: SpeechSynthesisUtterance | null = null;

function getPreferredVoice(preferredLang = "en-US") {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;
    return (
        voices.find((v) => v.lang === preferredLang) ||
        voices.find((v) => v.lang.startsWith(preferredLang.split("-")[0])) ||
        voices[0]
    );
}

export function speak(text: string, onEnd?: () => void) {
    if (typeof window === "undefined" || !window.speechSynthesis) {
        console.warn("TTS not supported");
        onEnd?.();
        return;
    }

    const speakNow = () => {
        try {
            if (currentUtterance) {
                window.speechSynthesis.cancel();
                currentUtterance = null;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            const voice = getPreferredVoice(utterance.lang);
            if (voice) utterance.voice = voice;

            let started = false;
            let fallbackTimer: number | null = null;

            utterance.onstart = () => {
                started = true;
                if (fallbackTimer) {
                    clearTimeout(fallbackTimer);
                    fallbackTimer = null;
                }
            };

            utterance.onend = () => {
                if (fallbackTimer) {
                    clearTimeout(fallbackTimer);
                    fallbackTimer = null;
                }
                currentUtterance = null;
                onEnd?.();
            };

            utterance.onerror = (e) => {
                try {
                    // Avoid passing potentially circular DOM objects to the dev overlay
                    const msg = (e && (e as any).error) || (e && (e as any).message) || String(e);
                    console.error("TTS error:", msg);
                } catch (logErr) {
                    try {
                        console.error("TTS error: unknown");
                    } catch (_) {
                        // ignore
                    }
                }

                if (fallbackTimer) {
                    clearTimeout(fallbackTimer);
                    fallbackTimer = null;
                }

                currentUtterance = null;
                try {
                    onEnd?.();
                } catch (_err) {
                    // ignore
                }
            };

            currentUtterance = utterance;
            try {
                window.speechSynthesis.resume?.();
            } catch (e) {
                // ignore
            }

            // If speak() doesn't actually start (browser requires gesture), call onEnd after a short delay
            fallbackTimer = window.setTimeout(() => {
                if (!started && !window.speechSynthesis.speaking) {
                    console.warn("TTS did not start — possibly blocked by browser autoplay/user gesture policy");
                    // ensure we clean up and notify caller
                    currentUtterance = null;
                    try {
                        onEnd?.();
                    } catch (_e) { }
                }
                fallbackTimer = null;
            }, 800);

            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.error("TTS failed to speak:", err);
            currentUtterance = null;
            onEnd?.();
        }
    };

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
        const onVoicesChanged = () => {
            window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
            speakNow();
        };

        window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);

        setTimeout(() => {
            window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
            speakNow();
        }, 500);

        return;
    }

    speakNow();
}

export function stopSpeaking() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
        window.speechSynthesis.cancel();
    } catch (e) {
        // ignore
    }
    currentUtterance = null;
}
