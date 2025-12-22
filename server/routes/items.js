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
    const item = new ClothingItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

