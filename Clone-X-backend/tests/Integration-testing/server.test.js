const request = require("supertest");
const app = require("../../app")

describe("Server connection", () => {
    it("should respond with status 200 on /", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Server running correctly")
    });
});