import express from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserCards,
  addCard,
  updateCard,
  deleteCard,
  getPublicCards,
} from "../controllers/cardController.js";

const router= express.Router();
const baseLimiterOptions= {
  windowMs: 60_000,
  standardHeaders: true,
  legacyHeaders: false,
};
const readLimiter= rateLimit({...baseLimiterOptions, max: 60});
const writeLimiter= rateLimit({...baseLimiterOptions, max: 30});

router.get("/public", readLimiter, getPublicCards);
router.get("/", readLimiter, verifyToken, getUserCards);
router.post("/", writeLimiter, verifyToken, addCard);
router.patch("/:id", writeLimiter, verifyToken, updateCard);
router.delete("/:id", writeLimiter, verifyToken, deleteCard);


export default router;
