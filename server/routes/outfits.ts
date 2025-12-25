// server/routes/outfit.ts
import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { wardrobe, stylePreference } = req.body; // wardrobe is your JSON array

  // 1) Create the prompt for Gemini
  const prompt = `
You are a fashion assistant. Given this wardrobe:

${JSON.stringify(wardrobe)}

Please suggest an outfit combination that matches a ${stylePreference || "casual"} style. 
Return a JSON object with fields: top, top_image, bottom, bottom_image, shoes, shoes_image.
`;

  try {
    // 2) Call Gemini API (pseudo code; replace with real endpoint)
    const geminiRes = await axios.post(
      "https://api.gemini.com/v1/chat/completions", // check actual Gemini endpoint
      {
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a fashion assistant." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = geminiRes.data.choices[0].message.content;
    const outfit = JSON.parse(text); // parse JSON returned by Gemini
    res.json(outfit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate outfit" });
  }
});

export default router;
