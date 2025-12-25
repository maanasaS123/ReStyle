//this file handles CRUD operations for clothing items in the database

import express from "express";
import ClothingItem from "../models/ClothingItem.js";

const router = express.Router();

// GET all clothing items
router.get("/", async (req, res) => {
  try {
    const items = await ClothingItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a clothing item
router.post("/", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const item = await ClothingItem.create({ imageUrl }); // extracted fields stay empty
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




export default router;

