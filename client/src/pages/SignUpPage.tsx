import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from '../components/UI_Elements/Button'

const SignUp: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("/Default_picture.jpg");

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]); // Store file for submission
      setPreview(URL.createObjectURL(e.target.files[0])); // Show preview
    }
  };

  // Handle form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create FormData to send files
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("bio", bio);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture); // Only append if a file is selected
      }
     
      await signup(formData); // Send FormData to backend
      await login(email, password); // Auto-login after signup
      navigate("/"); // Redirect to homepage
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
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <textarea
            placeholder="Biography"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>

          {/* Profile Picture Upload */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <img src={preview} alt="Profile Preview" className="w-20 h-20 rounded-full mt-2" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
          </div>

          <Button
            type="submit"
            className="w-full text-white bg-green-600 hover:bg-green-700"
          >
            Sign Up
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">Already have an account?</p>
          <Button 
            onClick={() => navigate("/login")} 
            className="text-blue-500 hover:underline"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
