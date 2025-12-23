import mongoose from "mongoose";

const clothingItemSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  color: { type: String, required: true },
  style: { type: String, required: true }
},
{ timestamps: true },
);

export default mongoose.model("ClothingItem", clothingItemSchema);
