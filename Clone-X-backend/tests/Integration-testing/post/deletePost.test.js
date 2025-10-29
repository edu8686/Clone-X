const app = require("../../../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Integration test for post", () => {
  let token;

  beforeAll(() => {
    const payload = { id: 1, username: "Usuario de prueba" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  it.skip("Should delete the post", async () => {
    const postId = 6;
    const res = await request(app)
      .delete(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post deleted");
  });
});

describe("Integration test for post", () => {
  let token;

  beforeAll(() => {
    const payload = { id: 1, username: "Usuario de prueba" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  it("Should not find the post to eliminate", async () => {
    const postId = 6;
    const res = await request(app)
      .delete(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Post not found");
  });
});
