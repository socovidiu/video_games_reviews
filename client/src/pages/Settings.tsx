import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Settings: React.FC = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [bio, setBio] = useState(user?.bio || "");

    const handleSave = () => {
        // Implement save logic (API call)
        console.log("Saving settings:", { username, bio });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="mb-4">
                <label className="block font-semibold">Username</label>
                <input
                    type="text"
                    className="border rounded p-2 w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block font-semibold">Bio</label>
                <textarea
                    className="border rounded p-2 w-full"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>
            <button
                style={{backgroundColor: '#3333FF', }}
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Save Changes
            </button>
        </div>
    );
};

export default Settings;
