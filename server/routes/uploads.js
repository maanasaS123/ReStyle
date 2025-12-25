//this file handles image uploads and uses Gemini API to extract clothing attributes

import express from "express";
import multer from "multer";
import path from "path";
import ClothingItem from "../models/ClothingItem.js";
import { extractClothingAttributes } from "../services/geminiVision.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // 1️⃣ Create a ClothingItem with analysis pending
    let newItem = await ClothingItem.create({
      imageUrl,
      analysisStatus: "pending"
    });

    // 2️⃣ Call Gemini to extract attributes
    try {
      const attributes = await extractClothingAttributes(req.file.path);

      // 3️⃣ Update ClothingItem with attributes
      newItem.name = attributes.name;
      newItem.category = attributes.category;
      newItem.color = attributes.color;
      newItem.style = attributes.style;
      newItem.analysisStatus = "done";

      await newItem.save();
    } catch (geminiError) {
      newItem.analysisStatus = "failed";
      newItem.analysisError = geminiError.message;
      await newItem.save();
    }

    // 4️⃣ Return item to frontend
    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image upload or analysis failed" });
  }
});

export default router;
