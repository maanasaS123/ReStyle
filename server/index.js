import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});