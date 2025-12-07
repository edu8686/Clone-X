const prisma = require("../prisma");
const { trace } = require("../routes/userRoutes");

async function createChat(req, res) {
  try {
    const myId = req.user.id; // viene del token JWT
    const { otherUserId } = req.body;

    // 1. Validación básica
    if (!otherUserId) {
      return res.status(400).json({ error: "otherUserId is required" });
    }

    // 2. Buscar si ya existe un chat 1 a 1 entre ambos
    const existingChat = await prisma.chat.findFirst({
      where: {
        isGroup: false,
        AND: [
          { users: { some: { userId: myId } } },
          { users: { some: { userId: otherUserId } } },
        ],
      },
      include: { users: true },
    });

    if (existingChat) {
      return res.json({ chat: existingChat, message: "Chat already exists" });
    }

    // 3. Crear nuevo chat y los UserChat correspondientes
    const chat = await prisma.chat.create({
      data: {
        isGroup: false,
        users: {
          create: [{ userId: myId }, { userId: otherUserId }],
        },
      },
      include: {
        users: {
          include: {
            user: true, // opcional → incluye data del usuario real
          },
        },
      },
    });

    return res.json({ chat });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating chat" });
  }
}

async function getChats(req, res) {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1; // default page 1
  const limit = parseInt(req.query.limit) || 10; // default 10 chats per page
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
            user: true,
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
  getChatMessages
};
