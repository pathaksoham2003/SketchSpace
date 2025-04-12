import mongoose from "mongoose";
import { config } from "dotenv";

config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_DB_URL;

    if (!mongoURI) {
      throw new Error("MONGO_DB_URL is not defined in environment variables.");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ MongoDB connected");
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
