const prisma = require("../prisma");
const bcrypt = require("bcrypt");

import bcrypt from "bcrypt";
import prisma from "../prisma/client.js"; // o el path que uses

export async function signUp(req, res) {
  const { name, username, email, password } = req.body;

  // Validaciones básicas
  if (!username || !email || !password || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Verificar si el usuario ya existe (por username o email)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y su perfil asociado en una sola operación
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        profile: {
          create: {
            name, // opcional: podés guardar el mismo nombre en el perfil
          },
        },
      },
      include: {
        profile: true, // devuelve también el perfil en la respuesta
      },
    });

    return res.status(201).json({
      message: "User and profile created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


async function startFollow(req, res) {
  const { userId, idUserToFollow } = req.body;

  if (Number(userId) === Number(idUserToFollow)) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  let user;
  let userToFollow;

  try {
    user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error with user" });
  }

  try {
    userToFollow = await prisma.user.findUnique({
      where: {
        id: Number(idUserToFollow),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error with userToFollow" });
  }

  if (!user || !userToFollow) {
    return res.status(404).json({ message: "User does not exist" });
  }

  try {
    const newFollow = await prisma.follow.create({
      data: {
        followerId: Number(userId),
        followedId: Number(idUserToFollow),
      },
    });
    return res.status(200).json({
      message: "Follow created",
      follow: newFollow,
      follower: { id: user.id, username: user.username },
      followed: { id: userToFollow.id, username: userToFollow.username },
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Already following this user" });
    }
    console.error("Error creating follow:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getFollowers(req, res) {
  const { userId } = req.params;

  try {
    const userFollowers = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      include: {
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!userFollowers) {
      return res.status(404).json({ message: "No followers found" });
    }

    const followersList = userFollowers.followers.map((f) => f.follower);

    return res.status(200).json({
      message: "Followers found",
      followers: followersList,
    });
  } catch (err) {
    console.error("Error getting followers:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getFollowings(req, res) {
  const { userId } = req.params;

  try {
    const userFollowings = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        following: {
          include: {
            following: {
              // usuario seguido
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!userFollowings) {
      return res.status(404).json({ message: "User not found" });
    }

    // Lista de usuarios seguidos
    const followingsList = userFollowings.following.map((f) => f.following);

    return res.status(200).json({
      message: "Followings found",
      followings: followingsList,
    });
  } catch (err) {
    console.error("Error getting followings:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  signUp,
  startFollow,
  getFollowers,
  getFollowings,
};
