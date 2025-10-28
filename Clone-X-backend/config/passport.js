const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const prisma = require("../prisma");
const bcrypt = require("bcrypt");
const { Strategy } = require("passport-local");
const ExtractJwt = require("passport-jwt").ExtractJwt;

// 1. Configurar estrategia JWT en passport
// 1.1 Objeto vacio para las opciones de la estrategia (se le pasa a new JwtStrategy)
const opts = {};

// 1.2 De dónde sacar el jwt cuando llegue request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// 1.3 Le indica a Passport la clave secreta que se usó para firmar los jwt
opts.secretOrKey = env.process.JWT_SECRET;

// 2. Crear el jwt asociado a un id
function createJWT(id) {
  return (token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  }));
}

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: "Passwords does not match" });
      }

      return done(null, user);
    } catch (err) {
      done(err);
    }
  })
);

passport.use( new JwtStrategy(opts, async function(jwt_payload, done){
    try {
        const user = prisma.user.findUnique({
            where : {
                id : jwt_payload.id
            }
        })
        if(user) {
            return done(null, user);
        }
        if(!user){
            return done(null, false)
        }

    } catch (err) {
        return done(err)
    }
}))

module.exports = {
  createJWT
};
