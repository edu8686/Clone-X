const prisma = require("../../prisma");
const { createPost } = require("../../controllers/postController");

describe("New post", () => {
  it("Should create new post", async () => {
    const req = {
      body: {
        userId: 1,
        text: "Primer post de prueba",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    prisma.post.create = jest.fn().mockResolvedValue({
      id: 1,
      userId: 1,
      text: "Primer post de prueba",
      likes: 0,
      createdAt: new Date(),
    });

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Post created",
        newPost: expect.objectContaining({
          userId: 1,
          text: "Primer post de prueba",
          likes: 0,
        }),
      })
    );
    // ✅ Opcional: verificar que newPost exista dentro de lo enviado a json
    const jsonResponse = res.json.mock.calls[0][0]; // primer llamado a res.json
    expect(jsonResponse.newPost).toBeDefined();
  });
});
