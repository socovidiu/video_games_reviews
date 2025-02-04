import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserData } from "../types/User"

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
        const token = localStorage.getItem("token");
        console.log(token);

        if (!token) {
            console.error("No token found");
            logout();
            navigate("/login");
            return;
        }

        try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        
        if (isMounted) {
            setUserData(response.data.user);
        }
        } catch (err) {
            console.error("Error fetching user data:", err);
            if (isMounted) {
                setError("Failed to fetch user data.");
            }
        }
    };

    fetchUserData();

    return () => {
        isMounted = false; // Cleanup
    };
    }, [logout, navigate]);

    const handleLogout = () => {
        logout();
    };

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!userData) {
        return <p>Loading user data...</p>;
    }

    return (
        <div>
            <h1>Welcome, {userData.username}</h1>
            <p>Email: {userData.email}</p>
            <p>Role: {userData.role}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;