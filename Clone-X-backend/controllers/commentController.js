const prisma = require("../prisma");

async function createComment(req, res) {
  const { postId, userId, text } = req.body;

  if (!postId || !text || !userId) {
    return res.status(400).json({ message: "Fields missing or invalid data" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        postId,
        userId,
      },
    });
    return res.status(201).json({ message: "Comment created", newComment });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({ Error: "Internal server error" });
  }
}

async function deleteComment(req, res) {
  const { postId, commentId } = req.params;

  try {
    await prisma.comment.delete({
      where: {
        id: Number(commentId),
      },
    });
    return res.status(200).json({ message: "Comment deleted correctly" });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ messsage: "Internal server error" });
  }
}

async function findCommentById(req, res) {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.status(200).json({ message: "Message found", comment });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findAllCommentsByPost(req, res) {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId : Number(postId),
      },
    });
    if (comments.length === 0) {
      return res.status(404).json({ message: "Comments not found" });
    }
    return res.status(200).json({ message: "Comments found", comments });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findCommentsByUserId(req, res) {
  const { userId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        where: { userId: Number(userId)},
      },
    });
    if (comments.length === 0) {
      return res.status(404).json({ message: "Comments not found" });
    }
    return res.status(200).json({ message: "Comments found", comments });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createComment,
  deleteComment,
  findCommentById,
  findAllCommentsByPost,
  findCommentsByUserId,
};
