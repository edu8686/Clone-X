const { Router } = require("express");
const postRouter = Router();
const postController = require("../controllers/postController");
const { passport } = require("../config/passport");

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
  passport.authenticate("jwt", { session: false }),
  postController.findPostsFromFollowed
);

postRouter.get(
  "/liked/:userId",
  passport.authenticate("jwt", { session: false }),
  postController.findPostsLikedByUserId
);

postRouter.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

postRouter.put("/i", postController.incrementPostLikes);

postRouter.put("/d", postController.decrementPostLikes);

module.exports = postRouter;
