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

/**
 * Seed a card and create JWTs for the trade API tests.
 * @returns {Promise<void>}
 */
const seedTradeData= async () => {
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
};

beforeAll(seedTradeData);

/**
 * Clean up test data and close the mongoose connection.
 * @returns {Promise<void>}
 */
const cleanupTradeData= async () => {
    await Card.deleteMany({});
    await mongoose.connection.close();
};

afterAll(cleanupTradeData);

/**
 * Verify unauthenticated access to trades is rejected.
 * @returns {Promise<void>}
 */
const shouldReturn401WhenNoTokenProvided= async () => {
    const res= await request(app).get("/api/trades");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/token/i);
};

/**
 * Verify validation errors are returned for missing trade fields.
 * @returns {Promise<void>}
 */
const shouldFailToCreateTradeWithMissingData= async () => {
    const res= await request(app)
        .post("/api/trades")
        .set("Authorization", `Bearer ${token}`)
        .send({cardId});
    
    expect(res.statusCode).toBe(400);
    expect(res.body.error || res.body.message).toMatch(/fields/i);
};

/**
 * Create a trade request and store its ID for later assertions.
 * @returns {Promise<void>}
 */
const shouldCreateTradeRequest= async () => {
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
};

/**
 * Fetch the trade list and assert the created trade is present.
 * @returns {Promise<void>}
 */
const shouldFetchTradesForAuthenticatedUser= async () => {
    const res= await request(app)
        .get("/api/trades")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((trade) => trade._id === tradeId)).toBe(true);
};

/**
 * Trade API test suite grouping.
 * @returns {void}
 */
const tradeApiSuite= () => {
    it("should return 401 when no token is provided", shouldReturn401WhenNoTokenProvided);
    it("should fail to create a trade when required data is missing", shouldFailToCreateTradeWithMissingData);
    it("should create a trade request", shouldCreateTradeRequest);
    it("should fetch trades for the authenticated user", shouldFetchTradesForAuthenticatedUser);
};

describe('Trade API', tradeApiSuite);
