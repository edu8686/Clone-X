const app = require("../../../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");


describe("Integration test for Post", () => {
  let token;

  beforeAll(() => {

    const payload = { id: 1, username: "usuarioPrueba" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  for (let index = 0; index < 5; index++) {
    it("Should create a post", async () => {
    const res =  await request(app)
      .post("/post/new-post")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: 1,
        text: `Post ${index}`,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Post created");
    expect(res.body.newPost).toBeDefined();
  });
  }

  
});
