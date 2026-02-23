/* eslint-disable @typescript-eslint/no-explicit-any */
// speech.ts

export function startSpeechRecognition(
    onInterim: (text: string) => void,
    onFinal: (text: string) => void
) {
    const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("SpeechRecognition not supported");
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const text = event.results[i][0].transcript;
            if (event.results[i].isFinal) final += text;
            else interim += text;
        }

        if (interim) onInterim(interim.trim());
        if (final) onFinal(final.trim());
    };

    // 🔥 AUTO RESTART WHEN BROWSER STOPS LISTENING
    recognition.onend = () => {
        console.log("STT ended");

        if ((window as any).__forceStopSTT) {
            console.log("Mic force stopped");
            return;
        }

        if ((window as any).__micLocked) {
            console.log("Mic locked during agent speech");
            return;
        }

        setTimeout(() => {
            try {
                recognition.start();
            } catch { }
        }, 300);
    };




    // 🔥 HANDLE ERRORS
    recognition.onerror = (e: any) => {
        console.warn("STT error:", e.error);

        // Ignore harmless errors
        if (e.error === "no-speech") {
            return; // browser auto handles
        }

        if (e.error === "aborted") {
            return; // happens when we manually stop()
        }

        if (e.error === "audio-capture") {
            console.warn("Mic not available");
            return;
        }

        if (e.error === "network") {
            setTimeout(() => {
                try {
                    recognition.start();
                } catch (err) {
                    console.warn("Failed to restart STT:", err);
                }
            }, 1000);
        }
    };


    recognition.start();
    return recognition;
}
