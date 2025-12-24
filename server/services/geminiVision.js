import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

function parseJsonFromGemini(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

function imageToGenerativePart(imagePath) {
  const abs = path.resolve(imagePath);
  const imageBuffer = fs.readFileSync(abs);

  const ext = path.extname(abs).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg";

  return {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType
    }
  };
}

const PROMPT = `
Return ONLY a JSON object with EXACT keys: name, category, color, style.

category MUST be EXACTLY one of: "top", "bottom", "shoes", "outerwear"
style MUST be EXACTLY one of: "casual", "formal", "sporty"

No markdown. No code fences. No extra text.
`;

export async function extractClothingAttributes(imagePath) {
  console.log("Analyzing image:", imagePath);
  console.log("Gemini key exists?", !!process.env.GEMINI_API_KEY);

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing at runtime");
  }

  // 🔑 CREATE GEMINI HERE (not at top of file)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const imagePart = imageToGenerativePart(imagePath);

  const result = await model.generateContent([
    { text: PROMPT },
    imagePart
  ]);

  const responseText = result.response.text();
  console.log("Gemini raw response:", responseText);

  return parseJsonFromGemini(responseText);
}
