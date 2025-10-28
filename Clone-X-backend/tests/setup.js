jest.mock('../config/passport.js', () => ({
  createJWT: jest.fn(() => 'token-falso'),
  authenticate: jest.fn(() => (req, res, next) => {
    req.user = { id: 1 }; // Simula usuario autenticado
    next();
  }),
}));
