import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// Emotion & stress label mapping (your existing mappings)
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

// Emotion color mapping (your existing mapping)
const emotionColors = {
    joy: "text-green-400 bg-green-400/20",
    happiness: "text-green-400 bg-green-400/20",
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

export default function TextAnalyzer() {
    const [text, setText] = useState("");
    const [emotion, setEmotion] = useState("");
    const [stress, setStress] = useState("");
    const [suggestions, setSuggestions] = useState("");
    const [loading, setLoading] = useState(false);

    // Initialize Gemini AI client
    const ai = new GoogleGenAI({
        apiKey: "AIzaSyCEJHG6mjmcM-POH_yJAyQjrxzTcuQhhYE", // replace with your key
    });

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setEmotion("");
        setStress("");
        setSuggestions("");

        try {
            // 1️⃣ Call Emotion & Stress APIs
            const [emotionRes, stressRes] = await Promise.all([
                fetch(
                    "https://moneshreddy-text-emotion-stress-api.hf.space/predict_emotion",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text }),
                    }
                ),
                fetch(
                    "https://moneshreddy-text-emotion-stress-api.hf.space/predict_stress",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text }),
                    }
                ),
            ]);

            const emotionData = await emotionRes.json();
            const stressData = await stressRes.json();

            const detectedEmotion =
                emotionLabels[emotionData.emotion] || emotionData.emotion;
            const detectedStress =
                stressLabels[stressData.stress_level] || stressData.stress;

            setEmotion(detectedEmotion);
            setStress(detectedStress);

            // 2️⃣ Call Gemini API with context
            const geminiPrompt = `
User text: "${text}"
Detected Emotion: "${detectedEmotion}"
Detected Stress: "${detectedStress}"

Provide friendly, actionable suggestions to improve mood or overcome stress in 5-6 sentences.
`;

            const geminiRes = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: geminiPrompt,
            });

            setSuggestions(geminiRes.text || "No suggestions available.");
        } catch (error) {
            console.error("Error:", error);
            alert(
                "Dont leave the page,Try Once More! .It may take some time to respond ,At the next attempt definitely it will work."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 sm:p-6 text-white">
            <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20 animate-fade-in-up">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in-scale">
                    Emotion, Stress & Gemini Suggestions
                </h1>

                <div className="space-y-6 animate-fade-in-up-delayed">
                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows="6"
                            placeholder="Type or paste your text here..."
                            className="w-full p-4 bg-black/20 text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none resize-none transition-all duration-300 placeholder-gray-400"
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {text.length} characters
                        </div>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !text.trim()}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                            loading || !text.trim()
                                ? "bg-gray-600 cursor-not-allowed opacity-50"
                                : "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg hover:shadow-xl"
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Analyzing...</span>
                            </div>
                        ) : (
                            "Analyze Text"
                        )}
                    </button>
                </div>

                {(emotion || stress) && (
                    <div className="mt-8 bg-gradient-to-r from-white/10 to-white/5 p-6 rounded-2xl text-center shadow-xl border border-white/20 animate-fade-in-scale">
                        <div className="space-y-4">
                            {emotion && (
                                <div className="flex items-center justify-center space-x-3 animate-slide-in-left">
                                    <span className="text-lg font-medium text-gray-300">
                                        Emotion:
                                    </span>
                                    <span
                                        className={`text-xl font-bold px-4 py-2 rounded-full ${
                                            emotionColors[
                                                emotion.toLowerCase()
                                            ] ||
                                            "text-yellow-300 bg-yellow-300/20"
                                        }`}
                                    >
                                        {emotion.charAt(0).toUpperCase() +
                                            emotion.slice(1)}
                                    </span>
                                </div>
                            )}
                            {stress && (
                                <div className="flex items-center justify-center space-x-3 animate-slide-in-right">
                                    <span className="text-lg font-medium text-gray-300">
                                        Stress Level:
                                    </span>
                                    <span
                                        className={`text-xl font-bold px-4 py-2 rounded-full ${
                                            stress === "stress"
                                                ? "text-red-300 bg-red-300/20"
                                                : "text-green-300 bg-green-300/20"
                                        }`}
                                    >
                                        {stress.charAt(0).toUpperCase() +
                                            stress.slice(1)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {suggestions && (
                    <div className="mt-6 bg-gradient-to-r from-white/10 to-white/5 p-4 rounded-xl shadow-md border border-white/20 animate-fade-in-scale">
                        <h2 className="text-lg font-semibold text-gray-300 mb-2">
                            Gemini Suggestions:
                        </h2>
                        <p className="text-gray-200 whitespace-pre-line">
                            {suggestions}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
