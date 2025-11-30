import React, { useState } from "react";
import Input from "../components/ui/Inputs";
import Buttons from "../components/ui/Buttons";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  //ravisankar@mail.com
  //ravisankar


  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    // console.log(email, password);

    try {
      const response = await api.post("/auth/login", { email, password });
      // console.log("Login successful:", response.data);
      // Later, we will save the token and redirect the user
      localStorage.setItem("accessToken", response.data.token);
      // console.log( "User data:", response.data.user);
      
      login(response.data.user);
      navigate("/chat");
    } catch (apiError) {
      console.log(apiError.response, "\n--------\n");
      const errorMessage =
        apiError.response?.data?.message ||
        "Login failed. Please check your credentials.";
      console.error("Login error:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Log in to your account
        </h2>
        {error && <p className="text-red-600 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleLogin}>
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
          <Buttons type="submit" className="w-full">
            Log In
          </Buttons>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
