import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Connect to MongoDB using the configured connection string.
 * Logs success outside test runs and exits the process on fatal errors.
 * @returns {Promise<void>}
 */
const connectDB= async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    if (process.env.NODE_ENV !== 'test') {
      console.log("MongoDB connected successfully");
    };
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};



export default connectDB;
