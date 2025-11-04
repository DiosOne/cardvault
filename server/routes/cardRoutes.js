import express from "express";
import Card from "../models/Card.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router= express.Router();

//get all cards belonging to user
router.get("/", verifyToken, async (req, res) => {
  try {
    const cards= await Card.find({userId: req.user.id});
    res.json(cards);
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

//add a new card
router.post("/", verifyToken, async (req, res) => {
  try {
    const newCard= new Card({
      ...req.body,
      userId: req.user.id,
    });
    const savedCard= await newCard.save();
    res.status(201).json(savedCard);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

//update a card belonging to user
router.patch("/:id", verifyToken, async (req, res)=> {
  try {
    const updatedCard= await Card.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id},
      req.body,
      {new: true, runValidators: true}
    );
    if (!updatedCard) return res.status(404).json({message: "Card not found or unauthorised"});
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

//delete a card belonging to user
router.delete("/:id",verifyToken, async (req,res) => {
  try {
    const deletedCard= await Card.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deletedCard) return res.status(404).json({message: "Card not found or unauthorised"});
    res.json({message: "Card deleted successfully"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

export default router;