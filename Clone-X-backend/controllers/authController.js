const { createJWT } = require("../config/passport");
const prisma = require("../prisma");

async function login(req, res) {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, username: true, email: true, profile : true},
    });

    if (user) {
      const token = createJWT(user.id);
      return res.status(200).json({ message: "User found", user, token });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log("Error al procesar request: ", err);
    return res.status(500).json({ err: "Server internal error" });
  }
}

module.exports = {
  login,
};
