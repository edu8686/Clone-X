const prisma = require("../prisma");

async function signUp(req, res) {
  const { name, username, email, password } = req.body;
  if (!username || !email) {
    return res.status(400).json({ message: "Fields missing" });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password,
      },
    });
    if (newUser) {
      return res
        .status(201)
        .json({ message: "User created", "New user": newUser });
    }
  } catch (error) {
    console.log("Error interno del servidor");
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  signUp,
};
