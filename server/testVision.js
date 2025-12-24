import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const file = process.argv[2]; // pass path from CLI
if (!file) throw new Error("Pass an image path: node testVision.js uploads/xxx.jpg");

const abs = path.resolve(file);
console.log("ABS:", abs);
console.log("EXISTS:", fs.existsSync(abs));
console.log("KEY:", !!process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY?.slice(0, 6));

const ext = path.extname(abs).toLowerCase();
const mime =
  ext === ".png" ? "image/png" :
  ext === ".webp" ? "image/webp" :
  "image/jpeg";

const imageBuffer = fs.readFileSync(abs);
const imagePart = { inlineData: { data: imageBuffer.toString("base64"), mimeType: mime } };

const PROMPT = "Return ONLY JSON with keys name, category, color, style.";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const res = await model.generateContent([{ text: PROMPT }, imagePart]);
const text = res.response.text();

function parseJsonFromGemini(t) {
  let cleaned = t.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "").trim();
  return JSON.parse(cleaned);
}

try {
  console.log("PARSED:", parseJsonFromGemini(text));
} catch (e) {
  console.log("PARSE FAILED. Raw was:", text);
  console.log("Parse error:", e.message);
}

