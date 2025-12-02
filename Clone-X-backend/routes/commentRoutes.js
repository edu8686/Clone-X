const { Router } = require("express")
const commentRouter = Router();
const commentController = require("../controllers/commentController");
const {passport} = require("../config/passport")

commentRouter.post("/new", passport.authenticate("jwt", { session : false}), commentController.createComment);
commentRouter.delete("/:commentId", passport.authenticate("jwt", {session : false}), commentController.deleteComment);
commentRouter.get("/:commentId", passport.authenticate("jwt", {session : false}), commentController.findCommentById);
commentRouter.get("/:postId", passport.authenticate("jwt", {session : false}), commentController.findAllCommentsByPost);
commentRouter.get("/:userId", passport.authenticate("jwt", {session : false}), commentController.findCommentsByUserId);



module.exports = commentRouter