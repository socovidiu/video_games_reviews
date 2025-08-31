import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContextProps } from "../types/Authentication"
import { UserData } from "../types/User"

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';



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
        const response = await axios.get(`${baseUrl}/auth/me`, {
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
    const { data } = await axios.post(`${baseUrl}/auth/login`, { email, password });
    // save the token
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    console.log("this is the user data:", data.user);
    } catch (error){
      console.error("Login error:", error);
      throw error; // Optionally, surface this to display the error in your UI
    }
  };

  const logout = async () => {
    // remove the token
    try {
      await axios.post(`${baseUrl}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("token"); // Clear token
      setUser(null);
      setToken(null);
      window.location.href = "/"; // Redirect to homepage
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const signup = async (formData: FormData) => {
    try {
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const { data } = await axios.post(`${baseUrl}/auth/signup`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
      });
      
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      console.log("User signed up:", data.user);
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};

const updateUser = async (updatedData: FormData) => {
  try {
      const response = await axios.put(`${baseUrl}/auth/update-profile`, updatedData, {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
          },
      });

      setUser(response.data.user);
  } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
  }
};


  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup, updateUser, isAuthenticated: !!token }}>
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
