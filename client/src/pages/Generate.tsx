// src/pages/Generate.tsx
import React, { useState } from "react";

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    // Call your Gemini/OpenAI API here
    setResult(`Generated outfit for: "${prompt}"`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Generate Outfit</h1>
      <textarea
        className="w-full border rounded p-2"
        placeholder="Enter outfit description..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="px-4 py-2 rounded bg-black text-white"
      >
        Generate
      </button>
      {result && <p className="mt-4">{result}</p>}
    </div>
  );
}
