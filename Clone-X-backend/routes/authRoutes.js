const { Router } = require("express")
const authController = require("../controllers/authController");
const passport = require("passport")
const authRouter = Router()

authRouter.post("/login", passport.authenticate("local", { session : false }), authController.login);

module.exports = authRouter