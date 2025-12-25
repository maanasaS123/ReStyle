import React, { useState } from "react";
import axios from "axios";

type OutfitResult = {
  top?: string;
  top_image?: string;
  bottom?: string;
  bottom_image?: string;
  shoes?: string;
  shoes_image?: string;
};

type OutfitPart = "top" | "bottom" | "shoes";

export default function Generate() {
  const [style, setStyle] = useState("");
  const [result, setResult] = useState<OutfitResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // 1) Fetch wardrobe from backend
      const wardrobeRes = await axios.get("http://localhost:5000/api/items");
      const wardrobe = wardrobeRes.data;

      if (!wardrobe || wardrobe.length === 0) {
        setError("Your wardrobe is empty. Please add items first.");
        return;
      }

      // 2) Call the outfits endpoint
      const outfitRes = await axios.post(
        "http://localhost:5000/api/outfits",
        {
          wardrobe,
          stylePreference: style || "casual",
        }
      );

      setResult(outfitRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate outfit. Check backend or Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Generate Outfit</h1>

      <input
        type="text"
        placeholder="Enter style (e.g., casual, formal, streetwear)"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Outfit"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Suggested Outfit</h2>

          <div className="flex flex-col space-y-4">
            {(["top", "bottom", "shoes"] as OutfitPart[]).map((part) => {
              const imageKey = `${part}_image` as keyof OutfitResult;

              return (
                <div key={part} className="flex items-center space-x-4">
                  <p className="font-bold capitalize w-20">{part}:</p>

                  <p>{result[part]}</p>

                  {result[imageKey] && (
                    <img
                      src={result[imageKey]}
                      alt={result[part]}
                      className="w-24 h-24 object-cover border rounded"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
