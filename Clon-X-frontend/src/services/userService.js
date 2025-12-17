import { API_URL } from "../config";
console.log("API_URL:", API_URL);

export async function getUsersToFollow(userId) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/user/${userId}/to-follow`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching users: ${res.status}`);
    }

    const data = await res.json();
    return data; 
  } catch (error) {
    console.error("❌ getUsersToFollow error:", error);
    return { users: [] };
  }
}

export async function startFollow(userId, idUserToFollow){
  const token = localStorage.getItem("token");
   try {
    const users = await fetch(`${API_URL}/user/new-follow`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body : JSON.stringify({userId, idUserToFollow})
    });

    if(!users) {
        return "No users found"
    }
    const data = await users.json();
    return data
  } catch (error) {
    console.log("Error: ", error);
    return error
  }
}

export async function stopFollow(userId, idUserToFollow){
  const token = localStorage.getItem("token");
   try {
    const users = await fetch(`${API_URL}/user/${userId}/${idUserToFollow}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if(!users) {
        return "No users found"
    }
    console.log("User stopped following")
    const data = await users.json();
    return data
  } catch (error) {
    console.log("Error: ", error);
    return error
  }
}
