import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { readLimiter, writeLimiter } from "../middleware/rateLimit.js";
import {
  getUserCards,
  addCard,
  updateCard,
  deleteCard,
  getPublicCards,
} from "../controllers/cardController.js";

const router= express.Router();
router.get("/public", readLimiter, getPublicCards);
router.get("/", verifyToken, readLimiter, getUserCards);
router.post("/", verifyToken, writeLimiter, addCard);
router.patch("/:id", verifyToken, writeLimiter, updateCard);
router.delete("/:id", verifyToken, writeLimiter, deleteCard);


export default router;
