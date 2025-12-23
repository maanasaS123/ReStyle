import { useEffect, useState } from "react";
import axios from "axios";

type Item = {
  _id: string;
  imageUrl: string;
  name?: string;
  category?: string;
  color?: string;
  style?: string;
  analysisStatus?: "pending" | "done" | "failed";
  analysisError?: string;
};

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
      setError("Could not load items. Check backend, CORS, or route.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please choose an image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1) Upload image
      const formData = new FormData();
      formData.append("image", selectedFile); // IMPORTANT: field name must match multer

      const uploadRes = await axios.post(
        "http://localhost:5000/api/uploads",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl: string | undefined = uploadRes.data?.imageUrl;

      if (!imageUrl) {
        throw new Error("Upload did not return imageUrl");
      }

      // 2) Create item in Mongo using the returned imageUrl
      await axios.post("http://localhost:5000/api/items", { imageUrl });

      // 3) Reset + refresh
      setSelectedFile(null);
      // clear the file input UI (quick trick)
      const input = document.getElementById("imageInput") as HTMLInputElement | null;
      if (input) input.value = "";

      await fetchItems();
    } catch (err) {
      let msg = "Could not upload/add item. Check upload route + multer field name.";
      // If backend sends useful message, show it
      if (axios.isAxiosError(err)) {
        msg =
          err.response?.data?.error ||
          err.message ||
          msg;
      }setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Closet</h1>

      <form onSubmit={onSubmit} className="space-y-4 border rounded-lg p-4">
        <div>
          <label className="block text-sm font-medium">Upload clothing image</label>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className="w-full border rounded p-2"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setSelectedFile(file);
            }}
          />
          <p className="text-xs text-gray-600 mt-1">
            Pick an image from your computer (jpg/png).
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Add Item"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">My Items</h2>

        {items.length === 0 ? (
          <p className="text-gray-600">No items yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item._id} className="border rounded p-3 space-y-2">
                <img
                  src={item.imageUrl}
                  alt="Clothing item"
                  className="w-32 h-32 object-cover rounded-md border"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />


                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {item.analysisStatus ?? "pending"}
                  </p>

                  {/* These will be empty until you implement analysis */}
                  {item.name && <p><span className="font-medium">Name:</span> {item.name}</p>}
                  {item.category && <p><span className="font-medium">Category:</span> {item.category}</p>}
                  {item.color && <p><span className="font-medium">Color:</span> {item.color}</p>}
                  {item.style && <p><span className="font-medium">Style:</span> {item.style}</p>}

                  {item.analysisStatus === "failed" && item.analysisError && (
                    <p className="text-red-600">
                      <span className="font-medium">Error:</span> {item.analysisError}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
