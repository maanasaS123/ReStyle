// src/pages/closet.tsx (or wherever your file is)
import { useEffect, useState } from "react";
import axios from "axios";
import ClothingCard, { type Item } from "../components/ClothingCard"; // Adjust import path

const MiniCard = ({ item }: { item: any }) => (
  // 'h-fit' ensures the container shrinks to fit the image height
  <div className="flex flex-col border border-gray-300 rounded overflow-hidden bg-white h-fit">
    
    {/* Removed the wrapper div with fixed height. 
        Now the image sits directly here. */}
    <img
      src={item.imageUrl}
      alt="cloud"
      style={{ 
        width: "25%",    // Forces image to fit the column width (scaled down)
        height: "auto",   // Calculates the exact height to keep original ratio
        display: "block"  // Removes tiny whitespace at the bottom of images
      }}
    />

    {/* Minimal text */}
    <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-[#4A403A] capitalize truncate">
            {item.name || item.category || "Untitled Item"}
          </h3>
        </div>

        {/* Tags / Pills */}
        <div className="flex flex-wrap gap-2">
          {item.style && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F9F8F6] text-[#8C847C] border border-[#EFE9E3]">
              {item.style}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {item.color && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F9F8F6] text-[#8C847C] border border-[#EFE9E3]">
              {item.color}
            </span>
          )}
        </div>
        
        {/* Status indicator (only for closet view) */}
        {item.analysisStatus && (
            <p className="text-xs text-gray-400 mt-2">
               Analysis: {item.analysisStatus}
            </p>
        )}
      </div>
  </div>
);

export default function Closet() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -- EXISTING LOGIC PRESERVED --
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
      await fetchItems();
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // -- END LOGIC --

  return (
    // PADDING: p-4 to keep it away from edges
    <div className="min-h-screen bg-[#F9F8F6] p-4 w-full">
      <div className="max-w-md mx-auto space-y-4">
        
        <h1 className="text-xl text-center text-[#4A403A] uppercase tracking-widest">
          My Closet
        </h1>

        {/* UPLOAD BAR */}
        <form onSubmit={onSubmit} className="flex gap-2">
          <label className="flex-1 border border-dashed border-[#C9B59C] p-2 text-center text-xs text-gray-500 cursor-pointer rounded bg-white">
             {selectedFile ? selectedFile.name : "+ Upload New"}
             <input type="file" accept="image/*" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
          </label>
          <button disabled={loading} className="bg-[#C9B59C] text-white px-4 text-xs font-bold rounded uppercase">
            {loading ? "..." : "Add"}
          </button>
        </form>

        {/* --- THE GRID FIX --- */}
        {/* grid-cols-3: Forces 3 items per row. gap-2: Tight spacing. */}
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <MiniCard key={item._id} item={item} />
          ))}
        </div>

        {/* Grid Display */}
        <div>
          <h2 className="text-xl font-medium text-[#4A403A] mb-6 border-b border-[#D9CFC7] pb-2">
            My Items ({items.length})
          </h2>
          
          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-[#D9CFC7] border-dashed">
              <p className="text-[#8C847C]">Your closet is empty. Upload your first item!</p>
            </div>
          ) : (
            // Using Masonry-like grid structure
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
               {items.map((item) => (
                 <div key={item._id} className="break-inside-avoid mb-6">
                    <MiniCard item={item} />
                 </div>
               ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}