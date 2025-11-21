// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/loginService";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {setLoginUser, setToken} = useContext(UserContext)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  async function handleLogin(){
    const { username, password } = formData;
    const result = await login(username, password);
    if(result.message === "User found"){
        setToken(result.token);
        setLoginUser(result.user);
        return result
    } 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Both fields are required.");
      return;
    }


    setLoading(true);
    try {
      // Aquí iría la llamada real al backend, p. ej.:
      // const res = await fetch("/api/login", { method: "POST", body: JSON.stringify(formData) })
      // if (!res.ok) throw new Error("Invalid credentials")
      handleLogin()
      navigate("/"); // redirige al home o dashboard
    } catch (err) {
      console.log("Error: ", err)
      setError("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-10 w-10 fill-white"
          >
            <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.949.564-2.005.974-3.127 1.195-.897-.959-2.178-1.555-3.594-1.555-2.719 0-4.924 2.205-4.924 4.924 0 .39.045.765.127 1.124C7.688 8.094 4.064 6.13 1.64 3.161c-.427.733-.666 1.584-.666 2.491 0 1.722.875 3.244 2.206 4.136-.813-.026-1.578-.249-2.247-.616v.061c0 2.404 1.71 4.405 3.977 4.86-.416.111-.855.171-1.309.171-.319 0-.63-.03-.935-.086.631 1.953 2.445 3.376 4.6 3.417-1.68 1.318-3.809 2.105-6.115 2.105-.398 0-.79-.023-1.175-.069 2.179 1.397 4.768 2.212 7.557 2.212 9.054 0 14.002-7.497 14.002-13.986 0-.213-.005-.425-.014-.636.962-.694 1.8-1.562 2.46-2.549z" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center">Sign in to X</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="email"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-black font-semibold py-3 rounded-full transition ${
              loading ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-200"
            }`}
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center mt-4">
          <div className="border-t border-neutral-700 w-1/3" />
          <span className="mx-2 text-neutral-500 text-sm">or</span>
          <div className="border-t border-neutral-700 w-1/3" />
        </div>

        {/* Links */}
        <p className="text-center text-neutral-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-blue-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
