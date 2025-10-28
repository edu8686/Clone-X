const request = require("supertest");
const prisma = require("../../generated/prisma");
const { signUp } = require("../../controllers/userController");
const app = require("../../app");

describe("User creation, no server", () => {
  it.skip("Should return status 201", async () => {
    const req = {
      body: {
        name: "Santiago",
        username: "nuevousername",
        email: "nuevousername@test.com.ar",
        password: "1234",
      },
    };

    const res = {
      statusCode: 0,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      },
    };

    await signUp(req, res);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User created");
  });
});

describe("User creation, with server", () => {
  it("Should return status 201", async () => {
    const res = await request(app)
      .post("/user/sign-up")
      .send({
          name: "Emanuel",
          username: "ema25",
          email: "ema25@test.com.ar",
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
