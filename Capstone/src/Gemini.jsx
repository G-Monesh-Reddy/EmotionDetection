import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const Gemini = () => {
    const [responseText, setResponseText] = useState("");
    const [loading, setLoading] = useState(false);

    // Initialize AI client
    const ai = new GoogleGenAI({
        apiKey: "AIzaSyCEJHG6mjmcM-POH_yJAyQjrxzTcuQhhYE",
    });

    // Function to call Gemini API
    const generateContent = async () => {
        setLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "What is nlp",
            });
            setResponseText(response.text);
        } catch (error) {
            console.error("Error generating content:", error);
            setResponseText("Failed to generate content.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold mb-2">Gemini AI Content</h2>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
                onClick={generateContent}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate AI Response"}
            </button>
            {responseText && (
                <div className="mt-2 p-2 border rounded bg-gray-50">
                    {responseText}
                </div>
            )}
        </div>
    );
};

export default Gemini;
