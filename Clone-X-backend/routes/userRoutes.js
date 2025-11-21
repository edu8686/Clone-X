const userController = require("../controllers/userController");
const { Router } = require("express")
const passport = require("passport")
const userRouter = Router();

userRouter.post("/sign-up", userController.signUp);
userRouter.post("/new-follow", passport.authenticate("jwt", {session : false}), userController.startFollow);
userRouter.delete("/:userId/:otherUserId", passport.authenticate("jwt", {session : false}), userController.deleteFollow);
userRouter.get("/:userId/followers", passport.authenticate("jwt", {session : false}), userController.getFollowers);
userRouter.get("/:userId/followings", passport.authenticate("jwt", {session : false}), userController.getFollowings);
userRouter.get("/:userId/to-follow", passport.authenticate("jwt", { session : false }), userController.findUsersNotfollowings)

module.exports = userRouter