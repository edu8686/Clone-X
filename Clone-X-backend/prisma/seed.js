const { PrismaClient } = require("../generated/prisma");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();

if (userCount > 1) {
  console.log("⚠️ DB ya inicializada, seed cancelado.");
  return;
}
  console.log("🌱 Iniciando seed de la base de datos...");

  // 🔥 Limpiar base de datos (orden correcto por relaciones)
  await prisma.follow.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Base de datos limpiada.");

  const users = [];

  // ==========================
  // 1️⃣ Usuarios + Perfiles
  // ==========================
  const USERS_COUNT = 15;

  for (let i = 0; i < USERS_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        profile: {
          create: {
            name: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birth: faker.date.birthdate({ min: 1950, max: 2005, mode: "year" }),
            biography: faker.lorem.sentences({ min: 1, max: 3 }),
            location: faker.location.city(),
            banner: faker.image.urlPicsumPhotos({ width: 1200, height: 400 }),
            profilePhoto: faker.image.avatar(),
          },
        },
      },
    });

    users.push(user);
  }

  console.log(`✅ ${users.length} usuarios creados.`);

  // ==========================
  // 2️⃣ Posts
  // ==========================
  const posts = [];

  for (const user of users) {
    const POSTS_PER_USER = faker.number.int({ min: 2, max: 6 });

    for (let i = 0; i < POSTS_PER_USER; i++) {
      const post = await prisma.post.create({
        data: {
          text: faker.lorem.paragraph({ min: 1, max: 4 }),
          userId: user.id,
          likes: faker.number.int({ min: 0, max: 150 }),
        },
      });

      posts.push(post);
    }
  }

  console.log(`✅ ${posts.length} posts creados.`);

  // ==========================
  // 3️⃣ Comentarios
  // ==========================
  for (const post of posts) {
    const COMMENTS_PER_POST = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < COMMENTS_PER_POST; i++) {
      const randomUser = faker.helpers.arrayElement(users);

      await prisma.comment.create({
        data: {
          text: faker.lorem.sentence(),
          postId: post.id,
          userId: randomUser.id,
        },
      });
    }
  }

  console.log("✅ Comentarios creados.");

  // ==========================
  // 4️⃣ Follows (red social realista)
  // ==========================
  const followSet = new Set();

  for (const follower of users) {
    const others = users.filter((u) => u.id !== follower.id);
    const FOLLOW_COUNT = faker.number.int({ min: 2, max: 5 });
    const followedUsers = faker.helpers.arrayElements(others, FOLLOW_COUNT);

    for (const followed of followedUsers) {
      const key = `${follower.id}-${followed.id}`;
      if (followSet.has(key)) continue;

      followSet.add(key);

      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followedId: followed.id,
        },
      });
    }
  }

  console.log("✅ Relaciones de follow creadas.");

  console.log("🌿 Seed completado con éxito!");
}

main()

  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
