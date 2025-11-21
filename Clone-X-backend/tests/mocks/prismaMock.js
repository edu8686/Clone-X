// Este archivo debe estar en una carpeta llamada __mocks__ 
// que esté al mismo nivel que node_modules, o dentro de tu directorio tests/.

const prisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  // ... añade otros modelos si es necesario
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

// Configuración por defecto para el éxito
prisma.user.findUnique.mockResolvedValue(null);
prisma.user.create.mockResolvedValue({
  id: 1,
  name: "Mock User",
  username: "mockuser",
  email: "mock@test.com",
  password: "hashedPassword123",
});

module.exports = prisma;
