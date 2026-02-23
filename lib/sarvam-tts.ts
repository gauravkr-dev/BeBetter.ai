let currentAudio: HTMLAudioElement | null = null;
let currentMediaSource: MediaSource | null = null;

const API_URL = "https://api.sarvam.ai/text-to-speech/stream";
const API_KEY = process.env.NEXT_PUBLIC_SARVAM_API_KEY!;

export async function speakWithSarvam(text: string, onEnd?: () => void) {
    try {
        stopSarvam();

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "api-subscription-key": API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text,
                target_language_code: "en-IN",
                speaker: "shubh",
                model: "bulbul:v3",
                pace: 0.9,
                speech_sample_rate: 22050,
                output_audio_codec: "mp3",
                enable_preprocessing: true
            })
        });

        if (!response.ok || !response.body) {
            throw new Error("Sarvam streaming failed");
        }

        const audio = new Audio();
        const mediaSource = new MediaSource();

        currentAudio = audio;
        currentMediaSource = mediaSource;

        audio.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener("sourceopen", async () => {
            const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
            const reader = response.body!.getReader();

            const waitForUpdateEnd = () =>
                new Promise<void>((resolve) => {
                    if (!sourceBuffer.updating) {
                        resolve();
                        return;
                    }
                    sourceBuffer.addEventListener("updateend", () => resolve(), { once: true });
                });

            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        // 🔥 wait for last append to finish
                        await waitForUpdateEnd();

                        if (mediaSource.readyState === "open") {
                            mediaSource.endOfStream();
                        }
                        break;
                    }

                    // 🔥 wait before appending
                    await waitForUpdateEnd();
                    sourceBuffer.appendBuffer(value);
                }
            } catch (err) {
                console.error("Streaming append error:", err);
                if (mediaSource.readyState === "open") {
                    mediaSource.endOfStream();
                }
            }
        });

        audio.onended = () => {
            stopSarvam();
            onEnd?.();
        };

        audio.onerror = () => {
            stopSarvam();
            onEnd?.();
        };

        await audio.play();

    } catch (err) {
        console.error("Sarvam TTS error:", err);
        onEnd?.();
    }
}

export function stopSarvam() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
        currentAudio = null;
    }

    if (currentMediaSource) {
        if (currentMediaSource.readyState === "open") {
            try {
                currentMediaSource.endOfStream();
            } catch { }
        }
        currentMediaSource = null;
    }
}