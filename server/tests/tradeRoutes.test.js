import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../index.js";
import Card from "../models/Card.js";

let token;
let cardId;
let toUserId;
let tradeId;
const fromUserId= new mongoose.Types.ObjectId();

beforeAll(async () => {
    token= jwt.sign({id: fromUserId}, process.env.JWT_SECRET, {expiresIn: "1h"});

    toUserId= new mongoose.Types.ObjectId();
    
    const card= await Card.create({
        name: "Test Trade Card",
        type: "Monster",
        rarity: "Rare",
        value: 1500,
        description: "Tradeable test card",
        userId: fromUserId,
    });

    cardId= card._id;
});

afterAll(async () => {
    await Card.deleteMany({});
    await mongoose.connection.close();
});

describe('Trade API', () => {
    it("should return 401 when no token is provided", async () => {
        const res= await request(app).get("/api/trades");
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });

    it("should fail to create a trade when required data is missing", async () => {
        const res= await request(app)
            .post("/api/trades")
            .set("Authorization", `Bearer ${token}`)
            .send({cardId});
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error || res.body.message).toMatch(/fields/i);
    });

    it("should create a trade request", async () => {
        const res= await request(app)
            .post("/api/trades")
            .set("Authorization", `Bearer ${token}`)
            .send({
                toUser: toUserId,
                cardId,
                message: "Interested in trading?",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("data");
        tradeId= res.body.data._id;
    });

    it("should fetch trades for the authenticated user", async () => {
        const res= await request(app)
            .get("/api/trades")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.some((trade) => trade._id === tradeId)).toBe(true);
    });
});
