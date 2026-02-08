import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import {
  getUserCards,
  addCard,
  updateCard,
  deleteCard,
  getPublicCards,
} from "../controllers/cardController.js";

const router= express.Router();
const readLimiter= createRateLimiter({windowMs: 60_000, max: 60});

router.get("/public", readLimiter, getPublicCards);
router.get("/", verifyToken, readLimiter, getUserCards);
router.post("/", verifyToken, addCard);
router.patch("/:id", verifyToken, updateCard);
router.delete("/:id", verifyToken, deleteCard);


export default router;
