import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash"
});

// Convert image file to Gemini inline data
function imageToGenerativePart(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);

  return {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: "image/jpeg" // change if your image is png
    }
  };
}

// Prompt for Gemini to extract clothing attributes
const PROMPT = `
You are a fashion analysis system.

Analyze the clothing item in the image and return ONLY valid JSON with:
- name: short descriptive name
- category: one of [top, bottom, shoes, outerwear]
- color: primary visible color
- style: one of [casual, formal, sporty]

Rules:
- Output JSON only
- No explanations
- No markdown
- Make the best reasonable guess if uncertain
`;

// Main function to call Gemini
export async function extractClothingAttributes(imagePath) {
  console.log("Analyzing image:", imagePath); // optional debug

  const imagePart = imageToGenerativePart(imagePath);

  const result = await model.generateContent([
    { text: PROMPT },
    imagePart
  ]);

  const responseText = result.response.text();

  try {
    return JSON.parse(responseText);
  } catch (err) {
    throw new Error("Failed to parse Gemini output as JSON: " + responseText);
  }
}
