const prisma = require("../prisma");

async function createPost(req, res) {
  const { userId, text } = req.body;

  if (!userId || !text) {
    return res.status(400).json({ message: "Fields missing" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        text,
      },
    });

    return res.status(201).json({ message: "Post created", newPost });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deletePost(req, res) {
  const { postId } = req.params;

  try {
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    return res.json({ message: "Post deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log("Error tryng to delete post: ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findPostsFromFollowed(req, res) {
  const { userId } = req.params;

  try {
    const follows = await prisma.follow.findMany({
      where: { followerId: Number(userId) },
      select: { followedId: true },
    });

    const followedIds = follows.map((f) => f.followedId);

    if (followedIds.length === 0) {
      return res.json([]);
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: { in: followedIds },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: { select: { profilePhoto: true } },
          },
        },
        comments: {
          select: {
            id: true,
            text: true,
            likes: true,
            createdAt: true,
            author: {
              select: { id: true, name: true, username: true },
            },
          },
        },
        likes: {
      include: {
        user: true   // acá obtenés el usuario que dio like
      }
    },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(posts);
  } catch (err) {
    console.error("findPostsFromFollowed ERROR:", err);
    return res.status(500).json({ error: "Error al obtener posts" });
  }
}

async function findPostsByUserId(req, res) {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User does not exist" });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        author: true,
      },
    });
    return res.status(200).json({ message: "Post found", post });
  } catch (err) {
    if (err.code === "P2025") {
      console.log("Error 404: ", err);
      return res.status(404).json({ Error: "Error 404. Posts not found" });
    }
    return res.status(500).json({ Error: "Internal Server error" });
  }
}

async function findPostById(req, res) {
  const { postId } = req.params;

  if (isNaN(Number(postId))) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  console.log("postId: ", postId);

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(postId),
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log("Post: ", post);
    res.status(200).json({ message: "Post found", post });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
}

async function findPostsSearch(req, res) {
  const searchTerm = req.query.term;

  console.log("Search term: ", searchTerm);

  if (!searchTerm || searchTerm.trim() === "") {
    console.log("Entered if-clause for empty");
    return res
      .status(400)
      .json({ message: "Search expression cannot be empty" });
  }

  try {
    const results = await prisma.post.findMany({
      where: {
        OR: [
          {
            author: { username: { contains: searchTerm, mode: "insensitive" } },
          },
          { text: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
    });
    if (results.length === 0) {
      return res.status(404).json({ message: "No results" });
    }

    console.log("Results: ", results);
    return res.status(200).json({ message: "Search successfull", results });
  } catch (err) {
    return res.status(500).json({ Error: "Internal server error" });
  }
}

async function randomSearch(req, res) {}

async function incrementPostLikes(req, res) {
  const { postId, userId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ message: "userId and postId are required" });
  }

  try {
    // Transacción atómica: evita race conditions y mantiene counts consistentes
    const [existingLike] = await prisma.like.findMany({
      where: { postId: Number(postId), userId: Number(userId) },
      take: 1,
    });

    if (existingLike) {
      // ya existe, devolvemos el estado actual sin duplicar
      const post = await prisma.post.findUnique({
        where: { id: Number(postId) },
      });
      return res
        .status(200)
        .json({ message: "Already liked", numLikes: post.numLikes });
    }

    await prisma.$transaction([
      prisma.like.create({
        data: { postId: Number(postId), userId: Number(userId) },
      }),
      prisma.post.update({
        where: { id: Number(postId) },
        data: { numLikes: { increment: 1 } },
      }),
    ]);

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    return res
      .status(200)
      .json({ message: "Incremented", numLikes: post.numLikes });
  } catch (err) {
    // si aún así cae P2002 por race, lo manejamos devolviendo estado actual
    if (err.code === "P2002") {
      const post = await prisma.post.findUnique({
        where: { id: Number(postId) },
      });
      return res
        .status(200)
        .json({ message: "Already liked (race)", numLikes: post.numLikes });
    }
    console.error("incrementPostLikes error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
}

async function decrementPostLikes(req, res) {
  const { postId, userId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ message: "userId and postId are required" });
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: { postId: Number(postId), userId: Number(userId) },
    });

    if (!existingLike) {
      const post = await prisma.post.findUnique({
        where: { id: Number(postId) },
      });
      return res
        .status(200)
        .json({ message: "Not liked", numLikes: post.numLikes });
    }

    await prisma.$transaction([
      prisma.like.delete({ where: { id: existingLike.id } }),
      prisma.post.update({
        where: { id: Number(postId) },
        data: { numLikes: { decrement: 1 } },
      }),
    ]);

    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });
    return res
      .status(200)
      .json({ message: "Decremented", numLikes: post.numLikes });
  } catch (err) {
    console.error("decrementPostLikes error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
}

async function updatePostSaved(req, res) {}

module.exports = {
  createPost,
  deletePost,
  findPostsByUserId,
  findPostById,
  findPostsSearch,
  incrementPostLikes,
  decrementPostLikes,
  findPostsFromFollowed,
};
