import asyncHandler from "express-async-handler";
import TradeRequest from "../models/tradeRequest.js";
import { MESSAGES } from "../utility/messages.js";

//new trade request
/**
 * Create a trade request from the authenticated user to another user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
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
/**
 * Fetch trades where the authenticated user is a participant.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getTrades= asyncHandler(async (req,res) => {
    const trades= await TradeRequest.find({
        $or: [{fromUser: req.user.id}, {toUser: req.user.id}],
    })
        .populate("fromUser", "username email")
        .populate("toUser", "username email")
        .populate("cardId", "name")
        .lean();
    
    res.json({
        success: true,
        data: trades,
    });
});

//update trade status or response
/**
 * Update a trade's status or response message for a participant.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const updateTrade= asyncHandler(async (req, res) => {
    const {status, responseMessage} = req.body;
    const trade= await TradeRequest.findById(req.params.id);

    if (!trade) {
        const error= new Error(MESSAGES.CARD_NOT_FOUND);
        error.statusCode= 404;
        throw error;
    }

    const requesterId= req.user.id;
    //Allow only involved users to respond to or update this trade.
    const isParticipant=
        trade.fromUser.toString() === requesterId ||
        trade.toUser.toString() === requesterId;

    if (!isParticipant) {
        const error= new Error(MESSAGES.TOKEN_INVALID);
        error.statusCode= 403;
        throw error;
    }

    if (status) {
        const allowed= ["pending", "accepted", "declined"];
        if (!allowed.includes(status)) {
            const error= new Error(MESSAGES.MISSING_DATA);
            error.statusCode= 400;
            throw error;
        }
        trade.status= status;
    }

    if (typeof responseMessage === "string") {
        trade.responseMessage= responseMessage;
    }

    await trade.save();

    await trade.populate([
        {path: "fromUser", select: "username email"},
        {path: "toUser", select: "username email"},
        {path: "cardId", select: "name"},
    ]);

    res.json({
        success: true,
        data: trade,
    });
});
