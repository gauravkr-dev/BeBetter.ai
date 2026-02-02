/* eslint-disable @typescript-eslint/no-explicit-any */
// speech.ts
export function startSpeechRecognition(
    onInterim: (text: string) => void,
    onFinal: (text: string) => void
) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn("SpeechRecognition not supported");
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
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

    recognition.onerror = (e: any) => {
        console.error("STT error:", e);
    };

    recognition.start();
    return recognition;
}
