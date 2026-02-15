import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5001/auth/register", {
        email,
        password,
      });

      alert("Registration successful! Please login.");
      navigate("/");

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl transform hover:scale-105 transition duration-300">

        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Register
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-5 p-3 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-3 rounded-xl bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 py-3 rounded-xl font-semibold shadow-lg"
        >
          Register
        </button>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;

