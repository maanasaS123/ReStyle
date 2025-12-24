import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import itemsRoutes from "./routes/items.js";
import uploadRoutes from "./routes/uploads.js";

import cors from "cors";

console.log("GEMINI_API_KEY exists?", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY first 6 chars:", process.env.GEMINI_API_KEY?.slice(0, 6));



console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


app.get("/", (req, res) => {
res.json({ message: "API running" });


});
app.use("/uploads", express.static("uploads"));
app.use("/api/uploads", uploadRoutes);


app.use("/api/items", itemsRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//test
app.get("/api/test-gemini-key", async (req, res) => {
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say OK");
    res.json({ ok: true, text: result.response.text() });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

