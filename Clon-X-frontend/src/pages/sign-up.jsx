import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { signUp } from "../services/signupService";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  async function handleSignUp(){
    const { name, username, email, password, password2 } = formData;
    const result = await signUp(name, username, email, password, password2);
    console.log(result)
    if(result.message === "User created"){
        navigate("/auth/login")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, username, email, password, password2 } = formData;

    if (!name || !username || !email || !password || !password2) {
      setError("All fields are required.");
      return;
    }

    if (password !== password2) {
      setError("Passwords do not match.");
      return;
    }

    setSuccess("Account created successfully!");
    console.log("Form submitted:", formData);
    handleSignUp()
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Create your account</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-black border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="bg-black border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="bg-black border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="bg-black border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />

          <input
            type="password"
            name="password2"
            placeholder="Confirm password"
            value={formData.password2}
            onChange={handleChange}
            className="bg-black border border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />

          <button
            type="submit"
            className="mt-4 bg-white text-black font-bold rounded-full py-3 hover:bg-gray-200 transition"
          >
            Sign up
          </button>
        </form>

        <p className="text-sm text-neutral-500 mt-6 text-center">
          Already have an account?{" "}
          <a href="/auth/login" className="text-sky-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
