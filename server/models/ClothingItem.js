//this file defines the ClothingItem model for MongoDB using Mongoose

import mongoose from "mongoose";

const clothingItemSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },

    // extracted later from image
    name: { type: String, default: "" },
    category: { type: String, default: "" }, // "top" | "bottom" | "shoes" later
    color: { type: String, default: "" },
    style: { type: String, default: "" },    // "casual" | "formal" | "sporty" later

    analysisStatus: {
      type: String,
      enum: ["pending", "done", "failed"],
      default: "pending",
    },
    analysisError: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ClothingItem", clothingItemSchema);
