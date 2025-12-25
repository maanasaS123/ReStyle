import React, { useState } from "react";
import axios from "axios";

export default function Generate() {
  const [style, setStyle] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 1) Fetch wardrobe from backend
      const wardrobeRes = await axios.get("http://localhost:5000/api/items");
      const wardrobe = wardrobeRes.data;

      // 2) Send to generate endpoint
      const outfitRes = await axios.post(
        "http://localhost:5000/api/generate-outfit",
        { wardrobe, stylePreference: style }
      );

      setResult(outfitRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Generate Outfit</h1>

      <input
        type="text"
        placeholder="Enter style (e.g., casual, formal)"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-black text-white rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Outfit"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Suggested Outfit</h2>
          <div className="flex flex-col space-y-4 mt-2">
            {["top", "bottom", "shoes"].map((part) => (
              <div key={part} className="flex items-center space-x-4">
                <p className="font-bold capitalize">{part}:</p>
                <p>{result[part]}</p>
                {result[`${part}_image`] && (
                  <img
                    src={result[`${part}_image`]}
                    alt={result[part]}
                    className="w-24 h-24 object-cover border rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
