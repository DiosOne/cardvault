import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("bufferCommands", false);

/**
 * Connect to MongoDB using the configured connection string.
 * Logs success outside test runs and only exits the process on production
 * startup failures.
 * @param {{ quiet?: boolean }} [options]
 * @returns {Promise<boolean>}
 */
const connectDB= async (options = {}) => {
  const {quiet = false} = options;

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);
    if (process.env.NODE_ENV !== 'test') {
      console.log("MongoDB connected successfully");
    };
    return true;
  } catch (error) {
    if (!quiet) {
      console.error("MongoDB connection failed:", error.message);
    }

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }

    if (!quiet && process.env.NODE_ENV !== "test") {
      console.warn("Continuing without MongoDB. Database-backed API routes will fail until MONGO_URI is fixed.");
    }

    return false;
  }
};



export default connectDB;
