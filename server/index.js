import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import itemsRoutes from "./routes/items.js";


console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


app.get("/", (req, res) => {
res.json({ message: "API running" });


});

app.use("/api/items", itemsRoutes);

const PORT = process.env.PORT || 5000;


app.listen(5000, () => {
  console.log("Server running on port 5000");
});