const userController = require("../controllers/userController");
const { Router } = require("express")
const userRouter = Router();

userRouter.post("/sign-up", userController.signUp);

module.exports = userRouter