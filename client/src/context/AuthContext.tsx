import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContextProps } from "../types/Authentication"
import { UserData } from "../types/User"

const API_BASE_URL = "http://localhost:3000/api/auth"; 


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Update Axios default headers whenever token changes
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
    console.log("Updated Authorization header:", axios.defaults.headers.common["Authorization"]);
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log("Stored token on mount:", storedToken);
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {

    if (!token) return;
    
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
          withCredentials: true,
        });
        console.log("User data fetched:", response); // Log to check
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        logout();
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
    const { data } = await axios.post(`${API_BASE_URL}/login`, { email, password });
    // save the token
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    } catch (error){
      console.error("Login error:", error);
      throw error; // Optionally, surface this to display the error in your UI
    }
  };

  const logout = async () => {
    // remove the token
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token"); // Clear token
      setUser(null);
      setToken(null);
      window.location.href = "/"; // Redirect to homepage
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
