import mongoose from "mongoose";

/**
 * Schema representing a trade request between two users.
 * @type {mongoose.Schema}
 */
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
        responseMessage: {type: String, default: ""},
    },
    {timestamps: true}
);

/**
 * TradeRequest model for trade workflow records.
 * @type {mongoose.Model}
 */
const TradeRequest= mongoose.model("TradeRequest", tradeRequestSchema);
export default TradeRequest;
