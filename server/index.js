import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cardRoutes from "./routes/cardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";

dotenv.config();
const app= express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} Host: ${req.headers.host} Origin: ${req.headers.origin}`);
next();
});

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/trades", tradeRoutes);

//Root route
app.get("/", (req, res) => {
  res.send("CardVault API is for sure running");
});

import {errorHandler} from "./middleware/errorHandler.js";

//global error handler
app.use(errorHandler);

//export for testing
export default app;

//only start server if not running tests
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
