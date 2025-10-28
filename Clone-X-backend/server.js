const app = require("./app")

// 1. Establecer puerto en el que escuchará el servidor

const PORT = process.env.PORT || 3000; 

// 2. Levanta el servidor

app.listen(PORT, () => console.log(`Listening on port : ${PORT}`));