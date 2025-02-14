import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBiography] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(username, email, password, bio);

      await login(email, password); // Auto-login after signup
      navigate("/"); // Redirect to home after successful signup
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="biography"
            placeholder="biography"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={bio}
            onChange={(e) => setBiography(e.target.value)}
          />
          <button type="submit"
           style={{backgroundColor: '#008000',}}
           className="w-full text-white py-2 rounded">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">Already have an account?</p>
          <button onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
