const { Router } = require("express")
const profileRouter = Router();
const profileController = require("../controllers/profileController")


profileRouter.put("/:userId", profileController.updateProfile);

module.exports =  profileRouter;