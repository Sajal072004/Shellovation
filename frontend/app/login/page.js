"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MailIcon, LockClosedIcon } from "@heroicons/react/solid";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if the user is already logged in
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const userData = { email, password };

    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store the token in localStorage
      localStorage.setItem("authToken", data.token);

      // Redirect to the dashboard page
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen flex flex-col justify-between">
      {/* Login Section */}
      <section className="relative w-full h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/fashion1.png')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center px-5 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl h-auto max-h-screen flex flex-col justify-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-center text-black">Login to Your Account</h1>
            <p className="text-xl lg:text-2xl mb-6 text-center text-gray-500">Welcome back! Please login to continue.</p>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-800 mb-2">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                  <MailIcon className="w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full outline-none ml-2 text-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-lg font-medium text-gray-800 mb-2">
                  Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                  <LockClosedIcon className="w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full outline-none ml-2 text-black"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-indigo-500 text-white px-6 py-3 rounded-lg w-full hover:bg-indigo-600 transition duration-300"
              >
                Login
              </button>

              <button
                type="button"
                className="mt-4 w-full py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300"
                onClick={() => window.location.href = "/"}
              >
                Go to Main Page
              </button>
            </form>

            <p className="mt-4 text-lg text-center text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-indigo-500 hover:text-indigo-600">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
