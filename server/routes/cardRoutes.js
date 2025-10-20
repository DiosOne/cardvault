import express from "express";
import Card from "../models/Card.js";

const router = express.Router();

// Get all cards
router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new card
router.post("/", async (req, res) => {
  try {
    const newCard = new Card(req.body);
    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Update a card by ID
router.patch("/:id", async (req, res)=> {
  try {
    const updatedCard= await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true, runValidators: true}
    );
    if (!updatedCard) return res.status(404).json({message: "Card Not Found"});
    res.json(updatedCard);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

//Delete by ID
router.delete("/:id", async (req,res) => {
  try {
    const deletedCard= await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) return res.status(404).json({message: "Card Not Found"});
    res.json({message: "Card Deleted Successfully"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

export default router;