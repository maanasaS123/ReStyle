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
    console.log("POST body:", req.body);
    const item = new ClothingItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("POST error:", err.message);
    res.status(400).json({ error: err.message });
  }
});



export default router;

