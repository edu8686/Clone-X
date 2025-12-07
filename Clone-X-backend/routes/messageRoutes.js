const { Router } = require("express")
const messageRouter = Router();
const messageController = require("../controllers/messageController");
const {passport} = require("../config/passport")

messageRouter.post("/:chatId/message", passport.authenticate("jwt", {session : false}), messageController.createMessage)
messageRouter.get("/:query", passport.authenticate("jwt", {session : false}), messageController.searchMessages)


module.exports = messageRouter