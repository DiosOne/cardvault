import Card from "../models/Card.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import {MESSAGES} from "../utility/messages.js";

//get all cards for the logged in user
export const getUserCards= asyncHandler(async (req, res) => {
    const cards= await Card.find({userId: req.user.id});
    res.status(200).json({
        success: true,
        data: cards,
    });
});

//add an new card
export const addCard= asyncHandler(async (req, res) => {
    const newCard= new Card({...req.body, userId: req.user.id});
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
