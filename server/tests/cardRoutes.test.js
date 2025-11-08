import request from "supertest";
import app from "../index.js";

describe("Card API", () => {
    it("should rreturn 401 when no token is provided", async () => {
        const res= await request(app).get("/api/cards");
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/token/i);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
