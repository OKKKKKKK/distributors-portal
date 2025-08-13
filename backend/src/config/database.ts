import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

const mongoUrl = process.env.MONGODB_URL;
if (!mongoUrl) {
  throw new Error("MongoDB connection URL is not defined in environment variables.");
}

export const connectToDatabase = async () => {
  try {
    dns.setDefaultResultOrder("ipv4first");

    await mongoose.connect(mongoUrl, {
      dbName: "distributors_portal",
    });

    console.log("✅ Mongoose connected");

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};
