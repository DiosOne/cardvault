import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../index.js";

let token;  //define globaly
let createdCardId; //track card id

beforeAll(() => {
    token= jwt.sign({id: new mongoose.Types.ObjectId() }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Card API", () => {
    it("should return 401 when no token is provided", async () => {
        const res= await request(app).get("/api/cards");
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });
});

it("should create a card and then update it", async () => {
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
});

it("should delete a card by ID", async () => {
    const res= await request(app)
        .delete(`/api/cards/${createdCardId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Card deleted successfully");
});

it("should fetch all cards for authorised user", async () => {
    const res= await request(app)
        .get("/api/cards")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
});
