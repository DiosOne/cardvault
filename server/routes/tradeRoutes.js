import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createTrade, getTrades } from "../controllers/tradeController.js";

const router= express.Router();

//authenticate trade routes
router.route("/")
    .post(verifyToken, createTrade)
    .get(verifyToken, getTrades);

export default router;
