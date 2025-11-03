const app = require("../../../app");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Start follow", () => {
  let token;

  beforeAll(() => {
    const payload = { id: 1, username: "edu86" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  it("Should start following", async () => {
    const res = await request(app)
      .post("/user/new-follow")
      .send({
        userId: "1", idUserToFollow: "15"
      })
      .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Follow created");
      expect(res.body.follow).toBeDefined();
      expect(res.body.follower).toBeDefined();
      expect(res.body.followed).toBeDefined();

  });
});
