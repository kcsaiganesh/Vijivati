"use client";

import React, { useState } from "react";
import { post } from "../../utils/api";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await post("/api/login", { username, password });
      console.log("Login success:", response);
    } catch (error) {
      console.error("Login failed:", error);
    }

    setUsername("");
    setPassword("");
  };

  return (
    <div className="mx-auto bg-white rounded-xl">
      <div className="border border-5 p-12 border-secondary rounded-xl">
        <h1 className="flex justify-center font-raleway text-xl">Login Page</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
