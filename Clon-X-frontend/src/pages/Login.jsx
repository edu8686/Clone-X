// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/loginService";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

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
      handleLogin()
      navigate("/"); 
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

        {/* Title */}
        <h2 className="text-3xl font-bold text-center">Sign in to Pulse</h2>

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
