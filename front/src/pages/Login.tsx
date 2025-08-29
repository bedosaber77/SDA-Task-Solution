import { useState, type FormEvent, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) throw new Error("AuthContext not found");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<{ token: string }>("/auth/login", {
        username,
        password,
      });
      auth.login(res.data.token);
      toast.success("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/projects"), 1200);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "❌ Login failed, try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
    <img src="/CURT.svg" alt="Logo" className="w-48 h-48 mb-4" />
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white shadow rounded w-80"
      >
        <h2 className="text-xl mb-4">Login</h2>
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
          Login
        </button>
      </form>
    </div>
    </div>
  );
}
