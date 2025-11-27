import { API_URL } from "../config";
export async function getPostsFromFollowed(userId) {
  const token = localStorage.getItem("token");

  try {
    const posts = await fetch(`${API_URL}/post/${userId}/followed`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!posts.ok) {
      throw new Error(`Error ${posts.status}: ${posts.statusText}`);
    }
    const data = await posts.json();
    return data;
  } catch (err) {
    console.log(err);
    return null
  }
}

export async function incrementLikes(postId, userId){
  try {
    await fetch(`${API_URL}/post/i`, {
      method : "PUT",
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({ postId, userId })
    })
  } catch(err){
    console.log("Error: ", err)
  }
} 

export async function decrementLikes(postId, userId){
  try {
    await fetch(`${API_URL}/post/d`, {
      method : "PUT",
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({ postId, userId })
    })
  } catch(err){
    console.log("Error: ", err)
  }
}

export async function getPostsByUserId() {}
