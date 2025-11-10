import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserCards,
  addCard,
  updateCard,
  deleteCard,
  getPublicCards,
} from "../controllers/cardController.js";

const router= express.Router();

router.get("/public", getPublicCards);
router.get("/", verifyToken, getUserCards);
router.post("/", verifyToken, addCard);
router.patch("/:id", verifyToken, updateCard);
router.delete("/:id", verifyToken, deleteCard);


export default router;