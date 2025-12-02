const { Router } = require("express")
const messageRouter = Router();
const messageController = require("../controllers/messageController");
const {passport} = require("../config/passport")

messageRouter.post("/:chatId/message", passport.authenticate("jwt", {session : false}), messageController.createMessage)


module.exports = messageRouter