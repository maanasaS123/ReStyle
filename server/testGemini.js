import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

console.log("TEST SCRIPT STARTED");
console.log("API key loaded?", !!process.env.GEMINI_API_KEY);

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function imageToGenerativePart(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  return {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: "image/png" // change to image/png if needed
    }
  };
}

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

async function test() {
  console.log("Calling Gemini 2.5 Flash with image...");

  // USE THE NEW MODEL NAME HERE
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  // <-- CHANGE THIS TO YOUR IMAGE PATH
  const imagePath = "./test.png"; // put your test image here
  const imagePart = imageToGenerativePart(imagePath);

  try {
    const result = await model.generateContent([
      { text: PROMPT },
      imagePart
    ]);

    const responseText = result.response.text();
    console.log("Gemini raw response:", responseText);

    try {
      const parsed = JSON.parse(responseText);
      console.log("Parsed JSON:", parsed);
    } catch (err) {
      console.error("Failed to parse Gemini output as JSON:", responseText);
    }

  } catch (error) {
    console.error("Error during generation:", error);
  }
}

test().catch(console.error);
