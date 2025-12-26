// src/pages/closet.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Item } from "../components/ClothingCard";

type MiniCardProps = { item: Item };

const MiniCard = ({ item }: MiniCardProps) => (
  <div
    className="
      group flex flex-col justify-between
      border border-[#EFE9E3] rounded-2xl overflow-hidden
      bg-white shadow-sm hover:shadow-md transition-shadow h-full
    "
  >
    <div className="p-3 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-semibold text-[#4A403A] capitalize truncate text-sm sm:text-base">
          {item.name || item.category || "Untitled Item"}
        </h3>

        {/* Tiny accent dot (subtle, doesn’t change sizing) */}
        <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-[#C9B59C] opacity-70 shrink-0" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {item.style && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-[#F9F8F6] text-[#8C847C] border border-[#EFE9E3]">
            {"Style: " + item.style}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {item.color && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-[#F9F8F6] text-[#8C847C] border border-[#EFE9E3]">
            {"Colour: " + item.color}
          </span>
        )}
      </div>
    </div>

    {/* IMAGE SECTION */}
    <div className="px-2 pb-2 mt-auto">
      <div
        className="relative"
        style={{
          width: "100%",
          height: 160,
          background: "#F9F8F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
          overflow: "hidden",
          borderRadius: 16,
        }}
      >
        {/* subtle border + hover glow */}
        <div className="absolute inset-0 rounded-2xl border border-[#EFE9E3] pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-white/35 to-transparent pointer-events-none" />

        {/* little “sparkle” graphics on hover (no assets needed) */}
        <div className="pointer-events-none absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-6 w-6 rounded-full bg-white/70 border border-[#EFE9E3] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2l1.2 6.2L19.5 10l-6.3 1.8L12 18l-1.2-6.2L4.5 10l6.3-1.8L12 2z"
                stroke="#C9B59C"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <img
          src={item.imageUrl}
          alt={item.name || item.category || "clothing item"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            borderRadius: 14, // ✅ rounds the image itself
          }}
          draggable={false}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    </div>
  </div>
);

export default function Closet() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setError("");
    try {
      const res = await axios.get<Item[]>("http://localhost:5000/api/items");
      setItems(res.data);
    } catch {
      setError("Could not load items.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      await axios.post("http://localhost:5000/api/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSelectedFile(null);

      const input = document.getElementById("imageInput") as HTMLInputElement | null;
      if (input) input.value = "";

      await fetchItems();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] w-full overflow-x-hidden">
      {/* ✅ Center the whole page content visually */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-[#4A403A] text-2xl sm:text-3xl font-semibold uppercase tracking-widest">
              My Closet
            </h2>
            <p className="text-sm text-[#8C847C] mt-1">
              Upload pieces and build outfits.{" "}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-[#EFE9E3] text-[#4A403A] text-xs font-semibold">
                {items.length} items
              </span>
            </p>
          </div>

          {/* little themed header graphic (no asset) */}
          <div className="hidden sm:flex items-center gap-2 text-[#8C847C] text-xs">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-[#EFE9E3]">
              curated wardrobe ✦
            </span>
          </div>
        </div>

        {/* Upload bar */}
        <form onSubmit={onSubmit} className="w-full flex flex-col sm:flex-row gap-3">
          <label
            className="
              flex-1 border border-dashed border-[#C9B59C]
              px-4 py-3 text-center text-sm text-[#4A403A]
              cursor-pointer rounded-2xl bg-white
              shadow-sm hover:shadow-md transition-shadow
            "
          >
            <span className="font-semibold">
              {selectedFile ? selectedFile.name : "Upload New"}
            </span>
            <span className="text-[#8C847C] font-medium">
              {!selectedFile ? " (PNG/JPG)" : ""}
            </span>

            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </label>

          <button
            disabled={loading || !selectedFile}
            className="
              bg-[#C9B59C] text-white px-6 py-3 text-sm font-bold rounded-2xl uppercase
              shadow-sm hover:opacity-95 active:opacity-90 transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "..." : "Add"}
          </button>
        </form>

        {error && (
          <div className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Items */}
        {items.length === 0 ? (
          <div className="w-full text-center py-16 bg-white rounded-3xl border border-[#D9CFC7] border-dashed">
            <div className="mx-auto mb-3 h-10 w-10 rounded-2xl bg-[#FBFAF8] border border-[#EFE9E3] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 16l8-4 8 4"
                  stroke="#4A403A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 5c0 3 4 3 4 6"
                  stroke="#C9B59C"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-[#4A403A] font-semibold">Your closet is empty.</p>
            <p className="text-[#8C847C] text-sm mt-1">Upload your first item!</p>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div
              className="
                grid gap-4 sm:gap-5
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-4
                xl:grid-cols-5
                w-fit
                place-content-center
              "
            >
              {items.map((item) => (
                <MiniCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/*
SUGGESTED “THEME” GRAPHICS (no extra assets needed):
1) Add tiny sparkles on hover (already added top-right of each image box).
2) Add a small “hanger/wardrobe” chip near the header (already: “curated wardrobe ✦”).
3) Optional: add a very subtle background pattern:
   - Use a light repeating radial gradient in the page container
   - Keeps your color scheme and doesn’t change sizing.
If you want that, I can paste the exact Tailwind/CSS line.
*/
