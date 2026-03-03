import React, { useState, useEffect } from "react";

/* -------------------- LABEL MAPPINGS -------------------- */

const emotionLabels = {
    LABEL_0: "admiration",
    LABEL_1: "amusement",
    LABEL_2: "anger",
    LABEL_3: "annoyance",
    LABEL_4: "approval",
    LABEL_5: "caring",
    LABEL_6: "confusion",
    LABEL_7: "curiosity",
    LABEL_8: "desire",
    LABEL_9: "disappointment",
    LABEL_10: "disapproval",
    LABEL_11: "disgust",
    LABEL_12: "embarrassment",
    LABEL_13: "excitement",
    LABEL_14: "fear",
    LABEL_15: "gratitude",
    LABEL_16: "grief",
    LABEL_17: "joy",
    LABEL_18: "love",
    LABEL_19: "nervousness",
    LABEL_20: "optimism",
    LABEL_21: "pride",
    LABEL_22: "realization",
    LABEL_23: "relief",
    LABEL_24: "remorse",
    LABEL_25: "sadness",
    LABEL_26: "surprise",
    LABEL_27: "neutral",
};

const stressLabels = {
    LABEL_0: "non-stress",
    LABEL_1: "stress",
};

const emotionColors = {
    joy: "text-green-400 bg-green-400/20",
    excitement: "text-yellow-400 bg-yellow-400/20",
    love: "text-pink-400 bg-pink-400/20",
    gratitude: "text-emerald-400 bg-emerald-400/20",
    pride: "text-orange-400 bg-orange-400/20",
    relief: "text-cyan-400 bg-cyan-400/20",
    optimism: "text-lime-400 bg-lime-400/20",
    approval: "text-green-300 bg-green-300/20",
    caring: "text-rose-400 bg-rose-400/20",
    admiration: "text-violet-400 bg-violet-400/20",
    amusement: "text-yellow-300 bg-yellow-300/20",
    sadness: "text-blue-400 bg-blue-400/20",
    anger: "text-red-400 bg-red-400/20",
    fear: "text-purple-400 bg-purple-400/20",
    disgust: "text-red-500 bg-red-500/20",
    disappointment: "text-gray-400 bg-gray-400/20",
    disapproval: "text-red-300 bg-red-300/20",
    embarrassment: "text-pink-300 bg-pink-300/20",
    grief: "text-indigo-400 bg-indigo-400/20",
    nervousness: "text-yellow-500 bg-yellow-500/20",
    remorse: "text-gray-500 bg-gray-500/20",
    annoyance: "text-orange-500 bg-orange-500/20",
    neutral: "text-gray-300 bg-gray-300/20",
    surprise: "text-yellow-300 bg-yellow-300/20",
    confusion: "text-amber-400 bg-amber-400/20",
    curiosity: "text-cyan-300 bg-cyan-300/20",
    desire: "text-pink-500 bg-pink-500/20",
    realization: "text-blue-300 bg-blue-300/20",
};

/* -------------------- COMPONENT -------------------- */

export default function TextAnalyzer() {
    const [text, setText] = useState("");
    const [emotion, setEmotion] = useState("");
    const [stress, setStress] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    /* -------- Pre-warm HuggingFace -------- */
    useEffect(() => {
        fetch("https://moneshreddy-text-emotion-stress-api.hf.space/").catch(
            () => {},
        );
    }, []);

    const handleAnalyze = async () => {
        if (!text.trim()) return;

        setLoading(true);
        setEmotion("");
        setStress("");
        setStatus("Connecting to AI models (cold start possible)...");

        try {
            /* Emotion */
            const emotionRes = await fetch(
                "https://moneshreddy-text-emotion-stress-api.hf.space/predict_emotion",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                },
            );

            if (!emotionRes.ok) throw new Error("Emotion API failed");

            const emotionData = await emotionRes.json();
            const detectedEmotion =
                emotionLabels[emotionData.emotion] || emotionData.emotion;

            setEmotion(detectedEmotion);

            /* Stress */
            const stressRes = await fetch(
                "https://moneshreddy-text-emotion-stress-api.hf.space/predict_stress",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text }),
                },
            );

            if (!stressRes.ok) throw new Error("Stress API failed");

            const stressData = await stressRes.json();
            const detectedStress =
                stressLabels[stressData.stress_level] || stressData.stress;

            setStress(detectedStress);

            setStatus("");
        } catch (error) {
            console.error(error);
            setStatus("⚠️ Model is waking up or experiencing load. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 text-white">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20">
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Emotion & Stress Analyzer
                </h1>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="6"
                    placeholder="Type your thoughts here..."
                    className="w-full p-4 bg-black/20 rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                />

                <button
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                    className={`w-full mt-4 py-3 rounded-xl font-semibold transition ${
                        loading || !text.trim()
                            ? "bg-gray-600 opacity-50"
                            : "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:scale-105"
                    }`}
                >
                    {loading ? "Analyzing..." : "Analyze Text"}
                </button>

                {status && (
                    <div className="mt-4 text-sm text-yellow-300 text-center animate-pulse">
                        {status}
                    </div>
                )}

                {(emotion || stress) && (
                    <div className="mt-6 p-6 bg-white/10 rounded-2xl text-center">
                        {emotion && (
                            <div className="mb-4">
                                Emotion:
                                <span
                                    className={`ml-3 px-4 py-2 rounded-full ${
                                        emotionColors[emotion.toLowerCase()] ||
                                        "bg-yellow-300/20 text-yellow-300"
                                    }`}
                                >
                                    {emotion}
                                </span>
                            </div>
                        )}

                        {stress && (
                            <div>
                                Stress Level:
                                <span
                                    className={`ml-3 px-4 py-2 rounded-full ${
                                        stress === "stress"
                                            ? "bg-red-300/20 text-red-300"
                                            : "bg-green-300/20 text-green-300"
                                    }`}
                                >
                                    {stress}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
