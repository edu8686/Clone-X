const API_URL = import.meta.env.VITE_API_URL;

export async function createMessage(chatId, text){

    const token = localStorage.getItem("token")

    try {
        const message = fetch(`${API_URL}/chat/messages/${chatId}/message`, {
            method : "POST",
            headers : {
                "Content-Type":"application/json",
                Authorization : `Bearer ${token}`
            },
            body : { text }
        })
        const data = (await message).json();
        return data
    } catch(err) {
        console.log("Error while trying to create message", err)
    }
}