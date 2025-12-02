const { Router } = require('express');
const {passport} = require('../config/passport')
const chatRouter = Router();
const chatController = require('../controllers/chatController');

chatRouter.post("/new", passport.authenticate("jwt", { session : false}), chatController.createChat);
chatRouter.get("/all", passport.authenticate("jwt", {session : false}), chatController.getChats)
chatRouter.delete("/:chatId", passport.authenticate("jwt", {session : false}), chatController.deleteChat);


module.exports = chatRouter