import React from "react";
import TextAnalyzer from "./TextAnalyzer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/EmotionDetection" element={<TextAnalyzer />} />
                <Route path="/" element={<TextAnalyzer />} />
            </Routes>
        </Router>
    );
}

export default App;
