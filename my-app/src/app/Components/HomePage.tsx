"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation"; // Use Next.js `useRouter` for navigation
export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false); // To toggle between login and register
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message
    setLoading(true); // Start loading state

    // Validate fields
    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false); // Stop loading
      return;
    }

    // Prepare request body
    const requestBody = {
      email,
      password,
    };

    try {
      const url = isRegistering
        ? "http://localhost:5000/register" // Use register URL when isRegistering is true
        : "http://localhost:5000/login"; // Use login URL for login

      // Send request to the appropriate endpoint
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.message) {
        if (isRegistering) {
          setError(data.message); // If registering, show message on error
        } else {
          // If logging in, save JWT and navigate to dashboard
          localStorage.setItem("authToken", data.token); // Store the JWT token
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading once done
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        {/* Header */}
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          {isRegistering ? "Create an Account" : "Welcome Back"}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email ID
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading} // Disable button while loading
              className={`w-full px-4 py-2 text-sm font-medium text-white ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } rounded`}
            >
              {loading
                ? isRegistering
                  ? "Creating Account..."
                  : "Logging In..."
                : isRegistering
                ? "Create Account"
                : "Log In"}
            </button>
          </div>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-blue-500 hover:underline"
          >
            {isRegistering
              ? "Already have an account? Log In"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
