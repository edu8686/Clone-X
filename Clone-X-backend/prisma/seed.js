const { PrismaClient } = require("../generated/prisma");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Limpiar base de datos antes de poblarla
  await prisma.follow.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const users = [];

  // 1️⃣ Crear usuarios y perfiles
  for (let i = 0; i < 10; i++) {
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
            birth: faker.date.birthdate(),
            biography: faker.lorem.sentence(),
            location: faker.location.city(),
            banner: faker.image.urlPicsumPhotos(),
            profilePhoto: faker.image.avatar(),
          },
        },
      },
    });
    users.push(user);
  }

  console.log(`✅ ${users.length} usuarios creados.`);

  // 2️⃣ Crear posts por usuario
  for (const user of users) {
    for (let j = 0; j < 3; j++) {
      await prisma.post.create({
        data: {
          text: faker.lorem.paragraph(),
          userId: user.id,
          likes: faker.number.int({ min: 0, max: 50 }),
        },
      });
    }
  }
  console.log("✅ Posts creados para cada usuario.");

  // 3️⃣ Crear comentarios aleatorios
  const allPosts = await prisma.post.findMany();
  for (const post of allPosts) {
    const randomUser = faker.helpers.arrayElement(users);
    await prisma.comment.create({
      data: {
        text: faker.lorem.sentence(),
        postId: post.id,
        userId: randomUser.id,
      },
    });
  }
  console.log("✅ Comentarios creados.");

  // 4️⃣ Relaciones de follow entre usuarios
  for (const follower of users) {
    const others = users.filter((u) => u.id !== follower.id);
    const follows = faker.helpers.arrayElements(others, 3); // sigue a 3 personas aleatorias
    for (const followed of follows) {
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
