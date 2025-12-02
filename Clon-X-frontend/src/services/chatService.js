const API_URL = import.meta.env.VITE_API_URL;

export async function createChat(otherUserId){
    const token = localStorage.getItem("token");

    try {
        const newChat = await fetch(`${API_URL}/chat/new`, {
            method : "POST",
            headers : {
                "Content-Type":"application/json",
                Authentication : `Bearer ${token}`
            },
            body : {otherUserId}
        });
        const data = newChat.json();
        return data
    } catch(err) {
        console.log("Error while creating chat", err)
    }
}


export async function getChats(){
    const token = localStorage.getItem("token");

    try {
        const chats = await fetch(`${API_URL}/chat/chats`, {
            method : "GET",
            headers : { Authentication : `Bearer ${token}`}
        });
        const data = chats.json();
        return data
    } catch(err) {
        console.log("Error obtaining the user's chats", err)
    }
}

export async function deleteChat(chatId){
    const token = localStorage.getItem("token");
    
    try{
        await fetch(`${API_URL}/chat/${chatId}`, {
            method : "DELETE",
            headers : {
                Authentication : `Bearer ${token}`
            }
        })
        
        return console.log("Chat deleted correctly")
    } catch(err){ 
        console.log("Chat colud not be deleted", err)
    }

}