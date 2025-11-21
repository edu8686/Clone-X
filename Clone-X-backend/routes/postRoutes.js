const { Router } = require("express");
const postRouter = Router();
const postController = require("../controllers/postController");
const passport = require("passport")

postRouter.post(
  "/new-post",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

postRouter.get(
  "/results",
  passport.authenticate("jwt", { session: false }),
  postController.findPostsSearch
);

postRouter.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  postController.findPostsByUserId
);

postRouter.get(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.findPostById
);

postRouter.get(
  "/:userId/followed", 
  passport.authenticate("jwt", {session : false}),
  postController.findPostsFromFollowed
)

postRouter.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);


module.exports = postRouter;