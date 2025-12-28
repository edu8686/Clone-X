const prisma = require("../prisma");
const { trace } = require("../routes/userRoutes");

async function createChat(req, res) {
  try {
    const myId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ error: "otherUserId is required" });
    }

    const chatInclude = {
      users: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    };

    // 1️⃣ Buscar chat existente
    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        AND: [
          { users: { some: { userId: myId } } },
          { users: { some: { userId: otherUserId } } },
        ],
      },
      include: chatInclude,
    });

    if (existingChat) {
      return res.json({ chat: existingChat });
    }

    // 2️⃣ Crear chat nuevo
    const chat = await prisma.chat.create({
      data: {
        isGroup: false,
        users: {
          create: [{ userId: myId }, { userId: otherUserId }],
        },
      },
      include: chatInclude,
    });

    return res.json({ chat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating chat" });
  }
}


async function getChats(req, res) {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },

        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip: skip,
      take: limit,
    });

    const totalChats = await prisma.chat.count({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
    });

    return res.json({
      page,
      limit,
      totalChats,
      totalPages: Math.ceil(totalChats / limit),
      chats,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
}

async function getChatMessages(req, res) {
  const { chatId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId: Number(chatId),
      },
      orderBy: {
        createdAt: "asc", // para mostrarlos en orden correcto
      },
    });

    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", err });
  }
}

async function deleteChat(req, res) {
  const { chatId } = req.params;
  console.log("chatId: ", chatId);

  if (!chatId || isNaN(chatId)) {
    return res.status(400).json({ message: "Invalid chatId" });
  }

  try {
    await prisma.chat.delete({
      where: {
        id: Number(chatId),
      },
    });
    console.log("Chat deleted successfully")
    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.log("Tipo de error:", err.name);
    console.log("Mensaje:", err.message);
    console.log("Rastreo de la pila:", err.stack);
    return res.status(500).json({ message: "Error when deleting chat", err });
  }
}

module.exports = {
  createChat,
  getChats,
  deleteChat,
  getChatMessages,
};
