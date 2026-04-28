import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../index.js";
import connectDB from "../db.js";

let token;  //define globaly
let createdCardId; //track card id
let dbConnected= false;

/**
 * Create a JWT for authenticated test requests.
 * @returns {void}
 */
const setAuthToken= async () => {
    dbConnected= await connectDB({quiet: true});
    token= jwt.sign({id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

beforeAll(setAuthToken);

/**
 * Close the mongoose connection after the test suite completes.
 * @returns {Promise<void>}
 */
const closeConnection= async () => {
    if (dbConnected) {
        await mongoose.connection.close();
    }
};

afterAll(closeConnection);

/**
 * Verify unauthenticated access is rejected.
 * @returns {Promise<void>}
 */
const shouldReturn401WhenNoTokenProvided= async () => {
    const res= await request(app).get("/api/cards");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/token/i);
};

/**
 * Card API test suite setup.
 * @returns {void}
 */
const cardApiSuite= () => {
    it("should return 401 when no token is provided", shouldReturn401WhenNoTokenProvided);
};

describe("Card API", cardApiSuite);

/**
 * Create a card and then update a field to verify write paths.
 * @returns {Promise<void>}
 */
const shouldCreateAndUpdateCard= async () => {
    if (!dbConnected) return;

    const newCard= {
        name: "Red-Eyes Black Dragon",
        type: "Monster",
        rarity: "Ultra Rare",
        value: 4000,
        description: "Joey Wheeler's signature card",
    };

    //create first
    const createRes= await request(app)
        .post("/api/cards")
        .set("Authorization", `Bearer ${token}`)
        .send(newCard);

    expect([200, 201]).toContain(createRes.statusCode);
    createdCardId= createRes.body.data?._id || createRes.body._id;

    //update card
    const updatedRes= await request(app)
        .patch(`/api/cards/${createdCardId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ value: 4200});

    expect(updatedRes.statusCode).toBe(200);
    expect(updatedRes.body.data.value).toBe(4200);
};

it("should create a card and then update it", shouldCreateAndUpdateCard);

/**
 * Delete the previously created card by ID.
 * @returns {Promise<void>}
 */
const shouldDeleteCardById= async () => {
    if (!dbConnected) return;

    const res= await request(app)
        .delete(`/api/cards/${createdCardId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Card deleted successfully");
};

it("should delete a card by ID", shouldDeleteCardById);

/**
 * Fetch all cards for the authorized user.
 * @returns {Promise<void>}
 */
const shouldFetchCardsForAuthorizedUser= async () => {
    if (!dbConnected) return;

    const res= await request(app)
        .get("/api/cards")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
};

it("should fetch all cards for authorised user", shouldFetchCardsForAuthorizedUser);
