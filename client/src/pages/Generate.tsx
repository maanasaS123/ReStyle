// src/pages/generate.tsx
import React, { useState } from "react";
import axios from "axios";

// Types specific to generation result
type OutfitResult = {
  top?: string;
  top_image?: string;
  bottom?: string;
  bottom_image?: string;
  shoes?: string;
  shoes_image?: string;
};

type ResultCardProps = {
  label: string;
  img?: string;
  text?: string;
};

const ResultCard = ({ label, img, text }: ResultCardProps) => (
  <div
    className="
      flex flex-col border border-gray-300 rounded-2xl bg-white overflow-hidden
      shrink-0 shadow-sm
      w-[110px] sm:w-[120px] md:w-[130px] lg:w-[150px]
    "
  >
    <div className="bg-[#C9B59C] text-white text-[10px] text-center font-bold uppercase py-1">
      {label}
    </div>

    {/* Fixed image frame + contain (no cropping, ever) */}
    <div
      style={{
        width: "100%",
        height: 150, // fixed box like closet fix
        background: "#F9F8F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        overflow: "hidden",
      }}
    >
      {img ? (
        <img
          src={img}
          alt={text || label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px]">
          ?
        </div>
      )}
    </div>

    <div className="p-2 text-center bg-white">
      <p className="text-[10px] md:text-xs text-gray-800 truncate">
        {text || "-"}
      </p>
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
      console.error(err);
      setError("Failed to generate outfit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#4A403A] uppercase tracking-widest">
              Stylist AI
            </h1>
            <p className="text-sm text-[#8C847C] mt-1">
              Describe the vibe. ReStyle picks a look.
            </p>
          </div>
        </div>

        {/* Input row */}
        <div className="bg-white border border-[#EFE9E3] rounded-3xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 text-sm bg-white"
              placeholder="E.g. Date night, cozy cafe, streetwear..."
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              className="bg-[#C9B59C] text-white px-6 py-3 text-sm font-bold rounded-2xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "..." : "Generate"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Your Outfit
              </h2>
              <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: "#F9F8F6" }} />
                <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: "#EFE9E3" }} />
                <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: "#D9CFC7" }} />
                <span className="w-6 h-6 rounded-full border border-black/10" style={{ background: "#C9B59C" }} />
              </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
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
