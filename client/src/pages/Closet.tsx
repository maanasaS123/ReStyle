import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

type Category = "top" | "bottom" | "shoes";
type Style = "casual" | "formal" | "sporty";

type ClothingForm = {
  name: string;
  category: Category;
  color: string;
  style: Style;
};

type Item = ClothingForm & {
  _id: string;
};

export default function Closet() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClothingForm>({
    defaultValues: {
      name: "",
      category: "top",
      color: "",
      style: "casual",
    },
  });

  const fetchItems = async () => {
    setError("");
    try {
      const res = await axios.get<Item[]>(
        "http://localhost:5000/api/items"
      );
      setItems(res.data);
    } catch {
      setError("Could not load items. Check backend, CORS, or route.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const onSubmit = async (data: ClothingForm) => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:5000/api/items",
        data
      );
      reset();          // clear form
      await fetchItems(); // refresh list
    } catch {
      setError("Could not add item. Check POST /api/items.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Closet</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border rounded-lg p-4"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            className="w-full border rounded p-2"
            placeholder="White T-Shirt"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            className="w-full border rounded p-2"
            {...register("category")}
          >
            <option value="top">top</option>
            <option value="bottom">bottom</option>
            <option value="shoes">shoes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Color</label>
          <input
            className="w-full border rounded p-2"
            placeholder="white"
            {...register("color", { required: "Color is required" })}
          />
          {errors.color && (
            <p className="text-sm text-red-600">
              {errors.color.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Style</label>
          <select
            className="w-full border rounded p-2"
            {...register("style")}
          >
            <option value="casual">casual</option>
            <option value="formal">formal</option>
            <option value="sporty">sporty</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">My Items</h2>

        {items.length === 0 ? (
          <p className="text-gray-600">No items yet.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item._id} className="border rounded p-3">
                <p className="font-bold">{item.name}</p>
                <p className="text-sm">Category: {item.category}</p>
                <p className="text-sm">Color: {item.color}</p>
                <p className="text-sm">Style: {item.style}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
