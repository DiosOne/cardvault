import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import cardRoutes from "./routes/cardRoutes.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
const app= express();

app.use(cors());
app.use(express.json());

//Connect to MongoDB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);

//Root route
app.get("/", (req, res) => {
  res.send("CardVault API is for sure running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import {errorHandler} from "./middleware/errorHandler.js";

//global error handler
app.use(errorHandler);
