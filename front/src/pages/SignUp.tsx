import { useState, type FormEvent } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await api.post("/auth/signup", { username, password });
      auth.login(res.data.token);
      toast.success("✅ Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/projects"), 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "❌ Signup failed, try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
    <img src="/CURT.svg" alt="Logo" className="w-48 h-48 mb-4" />
    <div className="flex justify-center items-center">
      <form onSubmit={handleSignup} className="p-6 bg-white shadow rounded w-80">
        <h2 className="text-xl mb-4">Sign Up</h2>

        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="border p-2 mb-2 w-full rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600 transition"
        >
          Sign Up
        </button>
      </form>
    </div>    
    </div>
  );
}
