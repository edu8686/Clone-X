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

module.exports = {createMessage}