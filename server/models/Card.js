import mongoose from "mongoose";

const cardSchema= new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  rarity: { type: String },
  value: { type: Number },
  description: { type: String },
  status: {
    type: String,
    enum: ["owned", "for trade", "wanted"],
    default: "owned",
  },

  //link cards to owners
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, 
{ timestamps: true }
);

const Card= mongoose.model("Card", cardSchema);
export default Card;
