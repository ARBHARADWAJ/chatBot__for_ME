// src/pages/RegisterPage.jsx

import React, { useState } from "react";
import Input from "../components/ui/Inputs";
import Button from "../components/ui/Buttons";
import api from "../services/api";
import axios from "axios";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 👈 State for displaying error messages
  const [success, setSuccess] = useState(""); // 👈 State for displaying success messages

  // We make the function 'async' to use 'await' for our API call
  const handleSubmit = async (event) => {
    // alert("started");
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userData = { name: fullName, email: email, password: password };
      // Use our api service to send a POST request to the /auth/register endpoint
      const response = await api.post("/auth/register", userData);
      // const sss=await axios.post('http://localhost:3000/api/auth/register', userData);

      // console.log("Registration successful:", response);
      setSuccess("Registration successful! You can now log in.");

      // Clear the form fields after a successful registration
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (apiError) {
      // If the API returns an error, we'll capture it here
      const errorMessage =
        apiError.response?.data?.message ||
        "An error occurred. Please try again.";
      console.error("Registration failed:", errorMessage.message);
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign up for an account
        </h2>
        {/* Display success or error messages */}
        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Input fields remain the same */}
          <div>
            <Input
              label="Full Name:"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Email:"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Password:"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          already having a account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
