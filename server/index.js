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
/**
 * Normalize user-provided values to avoid log injection.
 * @param {unknown} value
 * @returns {string}
 */
const sanitizeForLog= (value) =>
  String(value ?? '')
    .replace(/[\r\n\t]/g, ' ')
    .slice(0, 500);

/**
 * Log inbound HTTP requests with basic routing metadata.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
const requestLogger= (req, res, next) => {
  const method= sanitizeForLog(req.method);
  const url= sanitizeForLog(req.originalUrl);
  const host= sanitizeForLog(req.headers.host);
  const origin= sanitizeForLog(req.headers.origin);
  console.log(`[${new Date().toISOString()}] ${method} ${url} Host: ${host} Origin: ${origin}`);
  next();
};

app.use(requestLogger);

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/trades", tradeRoutes);

//Root route
/**
 * Health check endpoint for the API root.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {void}
 */
const rootHandler= (req, res) => {
  res.send("CardVault API is for sure running");
};

app.get("/", rootHandler);

import {errorHandler} from "./middleware/errorHandler.js";

//global error handler
app.use(errorHandler);

//export for testing
export default app;

//only start server if not running tests
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  /**
   * Start the HTTP server on the provided port.
   * @param {number|string} port
   * @returns {void}
   */
  const startServer= (port) => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  };

  startServer(PORT);
}
