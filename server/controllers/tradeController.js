import asyncHandler from "express-async-handler";
import TradeRequest from "../models/tradeRequest.js";
import { MESSAGES } from "../utility/messages.js";

//new trade request
export const createTrade= asyncHandler(async (req,res) => {
    const {toUser, cardId, message} = req.body;

    if (!toUser || !cardId) {
        const error= new Error(MESSAGES.MISSING_DATA);
        error.statusCode= 400;
        throw error;
    }

    const trade= await TradeRequest.create({
        fromUser: req.user.id,
        toUser,
        cardId,
        message,
    });

    res.status(201).json({
        success: true,
        data: trade,
    });
});

//show all trade requests to user
export const getTrades= asyncHandler(async (req,res) => {
    const trades= await TradeRequest.find({
        $or: [{fromUser: req.user.id}, {toUser: req.user.id}],
    })
        .populate("fromUser", "username email")
        .populate("toUser", "username email")
        .populate("cardId", "name");
    
    res.json({
        success: true,
        data: trades,
    });
});