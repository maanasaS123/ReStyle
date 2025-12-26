// src/pages/closet.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import type { Item } from "../components/ClothingCard";

type MiniCardProps = { item: Item };

const MiniCard = ({ item }: MiniCardProps) => (
  <div className="flex flex-col justify-between border border-[#EFE9E3] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow transition-shadow h-full">
    <div className="p-3 space-y-2">
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium text-muted capitalize truncate text-sm sm:text-base">
          {item.name || item.category || "Untitled Item"}
        </h3>
      </div>

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
    {/* We add padding (px-2 pb-2) here so the image container floats inside with rounded corners */}
    <div className="px-2 pb-2 mt-auto">
        <div
          style={{
            width: "100%",
            height: 160,
            background: "#F9F8F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 8,
            overflow: "hidden",
            borderRadius: 16, // THIS rounds the gray box itself
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.name || item.category || "clothing item"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-secondary text-2xl sm:text-3xl uppercase tracking-widest">
              My Closet
            </h2>
            <p className="text-sm text-secondary mt-1">
              Upload pieces and build outfits. ({items.length} items)
            </p>
          </div>
        </div>

        {/* Upload bar */}
        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 border border-dashed border-[#C9B59C] px-4 py-3 text-center text-sm text-secondary cursor-pointer rounded-2xl bg-white">
            {selectedFile ? selectedFile.name : "Upload New "}
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </label>

          <button
            disabled={loading}
            className="bg-[#C9B59C] text-white px-6 py-3 text-sm font-bold rounded-2xl uppercase disabled:opacity-50"
          >
            {loading ? "..." : "Add"}
          </button>
        </form>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Items */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#D9CFC7] border-dashed">
            <p className="text-secondary">Your closet is empty. Upload your first item!</p>
          </div>
        ) : (
          <div
            className="grid gap-4 sm:gap-5
                       grid-cols-2
                       sm:grid-cols-3
                       md:grid-cols-4
                       lg:grid-cols-4
                       xl:grid-cols-5"
          >
            {items.map((item) => (
              <MiniCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
