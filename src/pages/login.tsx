import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const { auth, login } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        login(data.token);
        router.push("/");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Failed to login.");
    }
  };

  return (
    <div className="flex justify-center items-center py-40">
      <form
        name="login"
        onSubmit={handleSubmit}
        className="flex flex-col space-y-2"
      >
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
        <button
          name="login-btn"
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
        {message && <div className="text-sm text-red-500">{message}</div>}
        <p className="text-center text-sm mt-12">
          Not have an account yet?{" "}
          <Link
            href="/register"
            className="text-blue-500 hover:text-blue-700 font-bold py-1 px-3 rounded"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
