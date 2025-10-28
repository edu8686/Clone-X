
const app = require("../../app");
const authRoutes = require("../../routes/authRoutes");
const request = require("supertest");


describe("Login tests", () => {
  it("Should login and return user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "Perez", password: "1234" });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User found")
  });
});
