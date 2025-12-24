import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import ClothingItem from "./models/ClothingItem.js"; 
async function reset() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const result = await ClothingItem.deleteMany({});
  console.log(`Deleted ${result.deletedCount} clothing items`);

  await mongoose.disconnect();
  console.log("Disconnected");
}

reset().catch((err) => {
  console.error(err);
  process.exit(1);
});
