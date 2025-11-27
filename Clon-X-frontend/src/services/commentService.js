import { API_URL } from "../config";
export async function createComment(postId, userId, text) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_URL}/post/comment/new`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`
            },
            body : JSON.stringify({ postId, userId, text})
        });
        if(!res.ok){
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json()
        return data
    } catch(err) {
        console.log(err)
        return null
    }
}