const request = require("supertest");
const prisma = require("../../generated/prisma");

const app = require("../../app");

describe("User creation, with server", () => {
  it("Should return status 201", async () => {
    const res = await request(app)
      .post("/user/sign-up")
      .send({
          name: "Emanuel",
          username: "ema27",
          email: "ema27@test.com.ar",
          password: "1234",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created");
  });

  it("Should return status 400", async () => {
    const res = await request(app)
      .post("/user/sign-up")
      .send({
          name: "Ernesto",
          username: "e90",
          password: "1234",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Fields missing");
  });

    it("Should return status 409", async () => {
    const res = await request(app)
      .post("/user/sign-up")
      .send({
          name: "Eduardo",
          username: "edu86",
          email: "test@test.com.ar",
          password: "1234",
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("User already exists");
  });
});
