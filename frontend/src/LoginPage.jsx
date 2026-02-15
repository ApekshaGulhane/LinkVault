import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/upload");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 flex items-center justify-center px-4">

    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition duration-300">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
         LinkVault
      </h1>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-5 p-4 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-6 p-4 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      />

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 py-3 rounded-xl font-semibold shadow-lg"
      >
        Login
      </button>

      {/* Register Link */}
      <p className="text-center text-gray-300 mt-6">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-purple-400 cursor-pointer hover:text-pink-400 transition"
        >
          Register
        </span>
      </p>

    </div>
  </div>
);
}

export default LoginPage;

