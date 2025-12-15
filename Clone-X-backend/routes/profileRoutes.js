const { Router } = require("express");
const profileRouter = Router();
const profileController = require("../controllers/profileController");
const multer = require("multer");
const { passport } = require("../config/passport");

const upload = multer({
  storage: multer.memoryStorage(),
});


profileRouter.patch(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 },
  ]),
  profileController.updateProfile
);


profileRouter.get("/:userId", profileController.getProfile);

module.exports = profileRouter;
