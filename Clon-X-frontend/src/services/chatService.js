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


export async function getChats() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/chat/all?page=1&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // FIX
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json(); // FIX
    return data;
  } catch (err) {
    console.log("Error obtaining the user's chats", err);
  }
}


export async function getChatMessages(chatId){
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/chat/${chatId}/messages`, {
      method : "GET",
      headers : {
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      }
    });
    const fullMessages = await res.json();
    console.log("fullMessages: ", fullMessages)
    return fullMessages
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