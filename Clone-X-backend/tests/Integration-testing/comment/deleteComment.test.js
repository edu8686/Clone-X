const app = require("../../../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Integration test for comment", () => {
  let token;

  beforeAll(() => {
    const payload = { id: 1, username: "edu86" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
  });

  it("Should delete a comment from a post", async () => {
    const res = await request(app)
      .delete("/post/comment/1/2")
      .set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200);

  });
});
