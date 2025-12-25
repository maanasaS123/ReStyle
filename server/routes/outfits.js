import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// REMOVED: const genAI = ... (This was running too early!)

router.post("/", async (req, res) => {
  const { wardrobe, stylePreference } = req.body;

  if (!wardrobe || wardrobe.length === 0) {
    return res.status(400).json({ error: "Wardrobe is empty" });
  }

  // FIX: Initialize Gemini HERE, inside the request
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Use Flash for speed
      generationConfig: { responseMimeType: "application/json" } // Force JSON
  });

  const prompt = `
    You are a fashion assistant.
    Given this wardrobe: ${JSON.stringify(wardrobe)}
    
    Choose ONE outfit for a "${stylePreference || "casual"}" style.
    
    Return a JSON object with this exact schema:
    {
      "top": "Description of top",
      "top_image": "Original image URL from wardrobe",
      "bottom": "Description of bottom",
      "bottom_image": "Original image URL from wardrobe",
      "shoes": "Description of shoes",
      "shoes_image": "Original image URL from wardrobe"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    
    // Since we used responseMimeType, we can parse safely
    const outfit = JSON.parse(result.response.text()); 
    res.json(outfit);

  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to generate outfit" });
  }
});

export default router;