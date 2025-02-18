import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const {user, logout } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Ensure profilePicture is a string (handle File objects)
  const profilePictureSrc = user?.profilePicture instanceof File
  ? URL.createObjectURL(user.profilePicture): user?.profilePicture || "/Default_picture.jpg"; // Fallback image

    
    // Handle Logout with Confirmation
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            setIsLoggingOut(true);
            logout();
        }
    };

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
              <p className="text-lg text-gray-700 animate-pulse">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-md bg-white shadow-lg rounded-lg">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <img
            src= {profilePictureSrc}
            alt="Profile"
            className="w-24 h-24 rounded-full border border-gray-300 shadow-sm"
          />
          <h1 className="text-2xl font-semibold mt-3">{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
  
        {/* Bio Section */}
        <div className="mt-4 px-4 text-center">
          <h2 className="text-lg font-semibold">Bio</h2>
          <p className="text-gray-600">{user.bio || "No bio available."}</p>
        </div>
  
        {/* Actions */}
        <div className="mt-6 flex flex-col items-center">
          <button
            style={{backgroundColor: '#3333FF', }}
            onClick={() => navigate("/settings")}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Edit Profile
          </button>
          <button
            style={{backgroundColor: '#f2401a', }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full mt-2 py-2 rounded-md transition ${
              isLoggingOut ? " cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    );
};

export default Dashboard;