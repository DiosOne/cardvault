import Card from "../models/Card.js";

//get all cards for the logged in user
export const getUserCards= async (req, res, next) => {
    try {
        const cards= await Card.find({userId: req.user.id});
        res.json(cards);
    } catch (err) {
        next(err);
    }
};

//add an new card
export const addCard= async (req, res, next) => {
    try {
        const newCard= new Card({
            ...req.body,
            userId: req.user.id,
        });
        const savedCard= await newCard.save();
        res.status(201).json(savedCard);
    } catch (err) {
        next (err);
    }
}

//update a card by id
export const updateCard= async (req, res, next) => {
    try {
        const updatedCard= await Card.findOneAndUpdate(
            {_id: req.params.id, userId: req.user.id},
            req.body,
            {new: true, runValidators: true}
        );
        if (!updatedCard)
            return res
                .status(404)
                .json({success: false, error: "Card not found or unauthorised"});
        res.json({success: true, data: updatedCard});
        } catch (err) {
            next (err);
        }
    };

//delete a card by id
export const deleteCard= async (req, res, next) => {
    try{
        const deletedCard= await Card.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!deletedCard)
            return res
                .status(404)
                .json({succees: false, error: "Card not found or unauthorised"});
        res.json({success: true, message: "Card deleted successfully"});
    } catch (err) {
        next(err);
    }
};