// src/pages/generate.tsx
import React, { useState } from "react";
import axios from "axios";
import ClothingCard from "../components/ClothingCard"; // Reuse the card!

// Types specific to generation result
type OutfitResult = {
  top?: string;
  top_image?: string;
  bottom?: string;
  bottom_image?: string;
  shoes?: string;
  shoes_image?: string;
};

// Fixed width: 100px. It CANNOT get bigger.
const ResultCard = ({ label, img, text }: any) => (
  <div style={{ width: "100px" }} className="flex flex-col border border-gray-300 rounded bg-white overflow-hidden shrink-0">
    <div className="bg-[#C9B59C] text-white text-[9px] text-center font-bold uppercase py-1">
      {label}
    </div>
    <div style={{ height: "100px", width: "100px" }}>
      {img ? (
        <img src={img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[9px]">?</div>
      )}
    </div>
    <div className="p-1 text-center bg-white">
      <p className="text-[9px] text-gray-800 truncate">{text || "-"}</p>
    </div>
  </div>
);

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
      const wardrobeRes = await axios.get("http://localhost:5000/api/items");
      if (!wardrobeRes.data || wardrobeRes.data.length === 0) {
        setError("Your wardrobe is empty.");
        return;
      }

      const outfitRes = await axios.post("http://localhost:5000/api/outfits", {
        wardrobe: wardrobeRes.data,
        stylePreference: style || "casual",
      });

      setResult(outfitRes.data);
    } catch (err) {
        console.error(err)
        setError("Failed to generate outfit.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to map result to Item format for our Card component
  const createItemFromPart = (desc?: string, img?: string) => ({
    name: desc || "Unknown Item",
    imageUrl: img,
    category: "Generated",
  });

  return (
    <div className="min-h-screen bg-[#F9F8F6] p-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        
        <h1 className="text-xl text-center text-[#4A403A] uppercase tracking-widest mt-4">
          Stylist AI
        </h1>

        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded p-2 text-sm"
            placeholder="E.g. Date night..."
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
          <button onClick={handleGenerate} className="bg-[#C9B59C] text-white px-4 text-sm font-bold rounded">
            {loading ? "..." : "GO"}
          </button>
        </div>

        {result && (
          <div className="bg-white p-4 rounded border border-gray-200">
            <h2 className="text-center text-xs font-bold text-gray-400 mb-4 uppercase">
              Your Outfit
            </h2>
            
            {/* FLEXBOX CENTER: Forces the 3 items to sit side-by-side centered */}
            <div className="flex flex-wrap justify-center gap-2">
              <ResultCard label="Top" img={result.top_image} text={result.top} />
              <ResultCard label="Bottom" img={result.bottom_image} text={result.bottom} />
              <ResultCard label="Shoes" img={result.shoes_image} text={result.shoes} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}