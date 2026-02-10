import express from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createTrade, getTrades, updateTrade } from "../controllers/tradeController.js";

const router= express.Router();
const baseLimiterOptions= {
  windowMs: 60_000,
  standardHeaders: true,
  legacyHeaders: false,
};
const readLimiter= rateLimit({...baseLimiterOptions, max: 60});
const writeLimiter= rateLimit({...baseLimiterOptions, max: 30});

//authenticate trade routes
router.route("/")
    .post(writeLimiter, verifyToken, createTrade)
    .get(readLimiter, verifyToken, getTrades);

router.patch("/:id", writeLimiter, verifyToken, updateTrade);

export default router;
