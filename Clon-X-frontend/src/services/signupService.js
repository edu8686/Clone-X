import { API_URL } from "../config";
console.log("API_URL:", API_URL);


export async function signUp(name, username, email, password, password2) {
  if (!name || !username || !password) {
    return "Name, username and password are mandatory";
  }

  if (password !== password2) {
    return "Passwords do not match";
  }

  try {
    const newUser = await fetch(`${API_URL}/user/sign-up`, {
        method : "POST",
        headers : {"Content-type" : "application/json"},
        body : JSON.stringify({
            name,
            username,
            email,
            password
        })
    });
    
    if (!newUser.ok) {
      throw new Error(`Error ${newUser.status}: ${newUser.statusText}`);
    }

    const data = await newUser.json();
    return data
  } catch (err) {
    console.log(err);
    return null;
  }
}
