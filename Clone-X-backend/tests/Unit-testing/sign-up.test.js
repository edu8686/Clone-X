const prisma = require("../../generated/prisma");

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