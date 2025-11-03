const app = require("../../../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Integration test for comment", () => {
  let token;

  beforeAll(() => {
    const payload = { id: 1, username: "edu86" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
  });

  it("Should add a comment to a post", async () => {
    const res = await request(app)
      .post("/post/comment/new")
      .set("Authorization", `Bearer ${token}`)
      .send({ postId: 1, userId: 1, text: "Cuarto comentario" });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Comment created");
      expect(res.body.newComment).toBeDefined();
  });
});
