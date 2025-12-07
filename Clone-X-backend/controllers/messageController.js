const prisma = require("../prisma");

async function createMessage(req, res){
    const {chatId} = req.params;
    const {text} = req.body;
    const userId = req.user.id;

 console.log("chatId", chatId)
    console.log("text", text)
    console.log("userId", userId)

    if(!userId || !text || !chatId) return res.status(404).json("Missing key information")

    try {
        const newMessage = await prisma.message.create({
            data : {
                chatId : Number(chatId),
                senderId : userId,
                text : text
            }
        });
        req.io.to(chatId.toString()).emit("new_message", newMessage);
        return res.status(201).json(newMessage);
    } catch(err){
        res.status(500).json({message: "Internal server error", err});
    }
}

// GET /chat/messages/:query
async function searchMessages(req, res) {
  const { query } = req.params;
  const userId = req.user.id; // asumimos que usás auth con passport/jwt

  if (!query || !query.trim()) {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        text: {
          contains: query,
          mode: "insensitive", // ✅ no distingue mayúsculas/minúsculas
        },
        chat: {
          users: {
            some: {
              userId: userId, // ✅ solo mensajes de chats donde participa el usuario
            },
          },
        },
      },
      include: {
        chat: true,
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(messages);
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      err,
    });
  }
}


module.exports = {createMessage, searchMessages}