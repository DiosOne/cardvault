import mongoose from "mongoose";

const tradeRequestSchema= new mongoose.Schema(
    {
        fromUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card",
            required: true,
        },
        message: {type: String, default:""},
        status: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending",
        },
    },
    {timestamps: true}
);

const TradeRequest= mongoose.model("TradeRequest", tradeRequestSchema);
export default TradeRequest;