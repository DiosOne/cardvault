import mongoose from "mongoose";
import Card from "../models/Card.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import {MESSAGES} from "../utility/messages.js";

const isValidObjectId= (value) => mongoose.Types.ObjectId.isValid(value);

const normalizeString= (value) =>
    typeof value === "string" ? value.trim() : "";

const normalizeOptionalString= (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") return undefined;
    return value.trim();
};

const normalizeNumber= (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed= Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
};

//get all cards for the logged in user
/**
 * Return all cards owned by the authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getUserCards= asyncHandler(async (req, res) => {
    const cards= await Card.find({userId: req.user.id}).lean();
    res.status(200).json({
        success: true,
        data: cards,
    });
});

//get all public trade cards
/**
 * Return cards marked as "for trade" or "wanted" for public browsing.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const getPublicCards= asyncHandler(async (req,res) => {
    const cards= await Card.find({status: {$in: ["for trade", "wanted"]}})
        .populate("userId", "username email")
        .lean();

    if (!cards || cards.length === 0) {
        return res.status(404).json({
            success: false,
            message: MESSAGES.CARD_NOT_FOUND,
        });
    }
    res.json({
        success: true,
        data: cards,
    });
});

//add an new card
/**
 * Create a new card linked to the authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const addCard= asyncHandler(async (req, res) => {
    const {name, type, rarity, value, description, status} = req.body;
    const normalizedName= normalizeString(name);

    //validation
    if (!normalizedName) {
        res.status(400);
        throw new Error(MESSAGES.MISSING_DATA);
    }

    const normalizedValue= normalizeNumber(value);
    if (value !== undefined && normalizedValue === undefined) {
        res.status(400);
        throw new Error(MESSAGES.MISSING_DATA);
    }

    //Ensure status is in the supported set to avoid invalid data.
    const allowedStatuses= ["owned", "for trade", "wanted"];
    const cardStatus= allowedStatuses.includes(status) ? status: "owned";

    const newCard= new Card({
        name: normalizedName,
        type: normalizeOptionalString(type),
        rarity: normalizeOptionalString(rarity),
        value: normalizedValue,
        description: normalizeOptionalString(description),
        status: cardStatus,
        userId: req.user.id,
    });

    const savedCard= await newCard.save();

    res.status(201).json({
        success: true,
        data: savedCard,
    });
});

//update a card by id
/**
 * Update an existing card owned by the authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const updateCard= asyncHandler(async (req, res) => {
    const cardId= req.params.id;
    if (!isValidObjectId(cardId)) {
        const error= new Error("Invalid ID format");
        error.statusCode= 400;
        throw error;
    }

    const updates= {};

    if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
        const normalizedName= normalizeString(req.body.name);
        if (!normalizedName) {
            const error= new Error(MESSAGES.MISSING_DATA);
            error.statusCode= 400;
            throw error;
        }
        updates.name= normalizedName;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "type")) {
        const normalizedType= normalizeOptionalString(req.body.type);
        if (normalizedType !== undefined) {
            updates.type= normalizedType;
        }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "rarity")) {
        const normalizedRarity= normalizeOptionalString(req.body.rarity);
        if (normalizedRarity !== undefined) {
            updates.rarity= normalizedRarity;
        }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "value")) {
        const normalizedValue= normalizeNumber(req.body.value);
        if (normalizedValue === undefined) {
            const error= new Error(MESSAGES.MISSING_DATA);
            error.statusCode= 400;
            throw error;
        }
        updates.value= normalizedValue;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
        const normalizedDescription= normalizeOptionalString(req.body.description);
        if (normalizedDescription !== undefined) {
            updates.description= normalizedDescription;
        }
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "status")) {
        const allowedStatuses= ["owned", "for trade", "wanted"];
        if (!allowedStatuses.includes(req.body.status)) {
            const error= new Error(MESSAGES.MISSING_DATA);
            error.statusCode= 400;
            throw error;
        }
        updates.status= req.body.status;
    }

    if (!Object.keys(updates).length) {
        const error= new Error(MESSAGES.MISSING_DATA);
        error.statusCode= 400;
        throw error;
    }

    const updatedCard= await Card.findOneAndUpdate(
        {_id: cardId, userId: req.user.id},
        updates,
        {new: true, runValidators: true}
    );

    if (!updatedCard) {
        const error= new Error(MESSAGES.CARD_NOT_FOUND);
        error.statusCode= 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        data: updatedCard,
    });
});

//delete a card by id
/**
 * Delete a card owned by the authenticated user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export const deleteCard= asyncHandler(async (req, res) => {
    const cardId= req.params.id;
    if (!isValidObjectId(cardId)) {
        const error= new Error("Invalid ID format");
        error.statusCode= 400;
        throw error;
    }

    const deletedCard= await Card.findOneAndDelete({
        _id: cardId,
        userId: req.user.id,
    });
    
    if (!deletedCard) {
        const error= new Error(MESSAGES.CARD_NOT_FOUND);
        error.statusCode= 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        message: MESSAGES.CARD_DELETED,
    });
});
