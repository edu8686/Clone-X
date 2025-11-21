const prisma = require("../prisma");
const bcrypt = require("bcrypt");

async function signUp(req, res) {
  const { name, username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
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
        password: hashedPassword,
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

async function findUsersNotfollowings(req, res) {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: userId },
      },
      select: {
        id: true,
        name: true,
        username: true,
        profile: {
          select: { biography: true },
        },
        followers: {
          where: { followerId: userId },
          select: { followerId: true },
        },
      },
    });

    const usersWithFollowFlag = users.map((u) => ({
      ...u,
      isFollowed: u.followers.length > 0,
    }));

    res.status(200).json({ message: "Users found", users: usersWithFollowFlag });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
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
    return res
      .status(500)
      .json({ message: "Internal server error with userToFollow" });
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

async function deleteFollow(req, res) {
  const { userId, otherUserId } = req.params;
  console.log(typeof userId)
  console.log(typeof otherUserId)


  if (isNaN(userId) || isNaN(otherUserId)) {
    return res.status(400).json({ error: "Invalid userId or otherUserId" });
  }

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: Number(userId),
          followedId: Number(otherUserId),
        },
      },
    });

    if (!follow) {
      return res.status(404).json({ message: "Follow relation not found" });
    }

    await prisma.follow.delete({
      where: {
        followerId_followedId: {
          followerId: Number(userId),
          followedId: Number(otherUserId),
        },
      },
    });

    res.json({ message: "Follow relation deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting follow relation" });
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

// 🔹 Función auxiliar (sin req/res)
// Función auxiliar
async function getFollowingsByUserId(userId) {
  const userFollowings = await prisma.user.findUnique({
    where: { id: Number(userId) },
    include: {
      following: {
        include: {
          followed: {
            select: {
              id: true,
              username: true,
              profile: {
                select: { biography: true },
              },
            },
          },
        },
      },
    },
  });

  if (!userFollowings) return [];

  // De cada Follow, saco el usuario seguido
  const followingsList = userFollowings.following.map((f) => f.followed);

  return followingsList;
}

module.exports = {
  signUp,
  startFollow,
  getFollowers,
  getFollowings,
  findUsersNotfollowings,
  deleteFollow,
};
