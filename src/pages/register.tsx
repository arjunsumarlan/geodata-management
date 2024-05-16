import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push("/");
      return;
    }
  }, [auth, auth.isAuthenticated, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (response.status === 200) {
        router.push("/login");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Failed to register.");
    }
  };

  return (
    <div className="flex justify-center items-center py-40">
      <form
        name="register"
        onSubmit={handleSubmit}
        className="flex flex-col space-y-2"
      >
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border-0 bg-purple-50 lg:w-56 px-2 py-2 ml-10 text-sm font-semibold text-purple-700"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border-0 bg-purple-50 lg:w-56 px-2 py-2 ml-11 text-sm font-semibold text-purple-700"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border-0 bg-purple-50 lg:w-56 px-2 py-2 ml-3 text-sm font-semibold text-purple-700"
            required
          />
        </div>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-lg border-0 bg-purple-50 lg:w-56 px-2 py-2 ml-12 text-sm font-semibold text-purple-700"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          name="register-btn"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
        {message && <div className="text-sm text-red-500">{message}</div>}
        <p className="text-center text-sm mt-12">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-700 font-bold py-1 px-3 rounded"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
