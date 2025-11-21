const API_URL = import.meta.env.VITE_API_URL;


export async function login(username, password){
    if (!username || !password) {
    return { success: false, error: "Ingresar username y password" }
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method : "POST", 
      headers : { "Content-Type": "application/json" },
      body : JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      
      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (err) {
    console.log(err);
    return { success: false, error: "Error en conexión con el servidor" }
  }
}