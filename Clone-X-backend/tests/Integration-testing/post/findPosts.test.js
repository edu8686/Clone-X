const app = require("../../../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Finding posts", () => {
  let token;

  beforeAll(() => {
    const payload = { id: 1, username: "edu86" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  it.skip("Should find posts by user id", async () => {
    const userId = 1;
    const res = await request(app)
      .get(`/post/user/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Posts found");
    expect(res.body.posts).toBeDefined();
  });

  it.skip("Should return a single post", async () => {
    const postId = 1;
    const res = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post found");
    expect(res.body.post).toBeDefined();
  });

  it("Should return posts and/or users", async () => {
    const searchTerm = "P";
    const res = await request(app)
      .get(`/post/results?term=${searchTerm}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Search successfull");
    expect(res.body.results).toBeDefined();
  });
});
