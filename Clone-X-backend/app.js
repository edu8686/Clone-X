// 1. Importar express
const express = require("express");

// 1.1 Otros imports 

const {passport}  = require("./config/passport");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const commentRouter = require("./routes/commentRoutes");
const profileRouter = require("./routes/profileRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes")
const http = require("http");
const { Server } = require("socket.io")

// 2. Crear express y servidor http
const app = express();
const server = http.createServer(app);

// 2.1 Crear instancia de socket.io sobre server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }
})

// 3. Importar cors para habilitar comunicación con el front
const cors = require("cors");

// 4. Habilitar la comunicación con origenes externos

app.use(cors({
    origin : [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    methods : ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    creedentials: true
}));

// 5. Import dotenv para manejar los entornos de desarrollo y producción

const dotenv = require("dotenv");

// 6. Cargar .env o .env.production automaticamente 
dotenv.config({
    path : process.env.NODE_ENV === "production" ? ".env.production" : ".env"
})

const PORT = process.env.PORT || 3000;


// 7. Definición de middlewares para parseo de datos por formulario y body de request
app.use(express.urlencoded({ extended : false }));
app.use(express.json());
app.use(passport.initialize());

// 7.1 Compartir io con routers
app.use((req, res, next) => {
    req.io = io;
    next()
})

// Tabla temporal de usuarios conectados
global.connectedUsers = {}

// 7.2 Eveentos de Socket.IO 
io.on("connection", (socket) => {
    console.log("Cliente conectado: ", socket.id)

    // Identificar usuario cuando se conecte
    socket.on("identity", (userId) => {
        global.connectedUsers[userId] = socket.id;
        console.log("Usuario identificado: ", userId, "->", socket.id)
    });
});


// 8. Definición de rutas

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server running correctly"})
})

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/post/comment", commentRouter);
app.use("/profile", profileRouter);
app.use("/chat", chatRouter);
app.use("/chat/messages/", messageRouter)

server.listen(PORT, () => {console.log(`Server + Socket.IO running on port ${PORT}`)})


 module.exports = {
    app,
    io,
    server
};
