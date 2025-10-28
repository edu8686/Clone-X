const prisma = require("../prisma");

async function login(req, res) { 
    const { username, password } = req.body;

    try{
        const user = await prisma.user.findUnique({
            where : {
                username
            }
        })
        if(user) {
            return res.status(200).json({message : "User found", user})
        }
    } catch(err) {
        console.log("Error al procesar request: ", err);
        return res.status(404).json({message : "User not found"}) 
    }
}


module.exports = {
    login
}