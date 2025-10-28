// 1. Importar express
const express = require("express");

// 1.1 Otros imports 

const userRouter = require("./routes/userRoutes")

// 2. Crear servidor
const app = express();

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

// 7. Definición de middlewares para parseo de datos por formulario y body de request
app.use(express.urlencoded({ extended : false }));
app.use(express.json());

// 8. Definición de rutas

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server running correctly"})
})

app.use("/user", userRouter)



 module.exports = app;
