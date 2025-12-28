// src/pages/generate.tsx
import React, { useState } from "react";
import axios from "axios";

// ------------------------------------------------------------------
// IMPORT CHECK: Make sure this file exists in your src/assets folder!
// If your file is a JPG, change .png to .jpg
// ------------------------------------------------------------------
import bgImage from "../assets/bg.png"; 

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
      shrink-0 shadow-sm shadown-lg backdrop-blur-sm transition-transform hover:scale-105 cursor-pointer
      w-[110px] sm:w-[120px] md:w-[130px] lg:w-[150px]
    "
  >
    <div className="bg-[#C9B59C] text-white text-[10px] text-center font-bold uppercase py-1 z-20">
      <b>{label}</b>
    </div>

    {/* Fixed image frame */}
    <div className="relative"
      style={{
        width: "100%",
        height: 325, 
        background: "transparent",
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
        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">
          ?
        </div>
      )}
    </div>

    <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-white text-[10px] md:text-xs text-center font-medium leading-tight">
        {text || label}
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
    // relative container allows content to flow naturally
    <div className="relative min-h-screen w-full isolation-auto">
      
      {/* ------------------------------------------------------ */}
      {/* BACKGROUND LAYER: z-index: -1 forces it to the back    */}
      {/* ------------------------------------------------------ */}
      <div
        style={{
          position: "fixed", // Keeps image stuck to screen while scrolling
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1, // CRITICAL FIX: Puts image behind everything else
        }}
      />

      {/* ------------------------------------------------------ */}
      {/* CONTENT LAYER: The semi-transparent overlay + content  */}
      {/* ------------------------------------------------------ */}
      <div className="min-h-screen w-full bg-[#F9F8F6]/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-8">
          
          {/* Header */}
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl text-[#4A403A] uppercase tracking-widest font-bold">
                Stylist AI
              </h1>
              <p className="text-sm text-[#8C847C] mt-1 font-medium">
                Describe the vibe. ReStyle picks a look.
              </p>
            </div>
          </div>

          {/* Input Box */}
          <div className="bg-white/90 border border-[#EFE9E3] rounded-3xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9B59C] focus:border-transparent"
                placeholder="E.g. Date night, cozy cafe, streetwear..."
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                className="bg-[#C9B59C] hover:bg-[#B8A38B] transition-colors text-white px-8 py-3 text-sm font-bold rounded-2xl disabled:opacity-50 shadow-md"
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

          {/* Results Area */}
          {result && (
            <div className="bg-white/90 p-5 sm:p-6 rounded-3xl border border-gray-200 shadow-lg backdrop-blur-sm animate-fade-in-up">
              <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                  Your Outfit
                </h2>
                {/* Palette circles */}
                <div className="flex gap-2">
                  <span className="w-6 h-6 rounded-full border border-black/10 bg-[#F9F8F6]" />
                  <span className="w-6 h-6 rounded-full border border-black/10 bg-[#EFE9E3]" />
                  <span className="w-6 h-6 rounded-full border border-black/10 bg-[#D9CFC7]" />
                  <span className="w-6 h-6 rounded-full border border-black/10 bg-[#C9B59C]" />
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
    </div>
  );
}