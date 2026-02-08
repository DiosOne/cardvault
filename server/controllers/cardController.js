import Card from "../models/Card.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import {MESSAGES} from "../utility/messages.js";

//get all cards for the logged in user
export const getUserCards= asyncHandler(async (req, res) => {
    const cards= await Card.find({userId: req.user.id}).lean();
    res.status(200).json({
        success: true,
        data: cards,
    });
});

//get all public trade cards
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
export const addCard= asyncHandler(async (req, res) => {
    const {name, type, rarity, value, description, status} = req.body;

    //validation
    if (!name) {
        res.status(400);
        throw new Error(MESSAGES.MISSING_DATA);
    }

    //ensure status
    const allowedStatuses= ["owned", "for trade", "wanted"];
    const cardStatus= allowedStatuses.includes(status) ? status: "owned";

    const newCard= new Card({
        name,
        type,
        rarity,
        value,
        description,
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
export const updateCard= asyncHandler(async (req, res) => {
    const updatedCard= await Card.findOneAndUpdate(
        {_id: req.params.id, userId: req.user.id},
        req.body,
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
export const deleteCard= asyncHandler(async (req, res) => {
    const deletedCard= await Card.findOneAndDelete({
        _id: req.params.id,
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
