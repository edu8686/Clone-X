const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();

console.log("Prisma client creado")

module.exports = prisma;