import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Settings: React.FC = () => {
    const { user, updateUser } = useAuth();

    // Initialize form fields with current user data
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        bio: user?.bio || "",
        role: user?.role || "user",
        profilePicture: user?.profilePicture || "/Default_picture.jpg",
    });

    const [avatar, setAvatar] = useState<File | null>(null);
    const [preview, setPreview] = useState(user?.profilePicture || "/default-avatar.jpg");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Handle text input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file input change for profile picture
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0])); // Show image preview
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("username", formData.username);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("bio", formData.bio);
    
            if (avatar) {
                formDataToSend.append("profilePicture", avatar); // Only append if a new image is uploaded
            }
            console.log(formDataToSend);
            await updateUser(formDataToSend);
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            setMessage("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            {/* Profile Picture Upload */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <img src={typeof preview === "string" ? preview : ""} alt="Profile" className="w-24 h-24 rounded-full border mt-2" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2"
                        required
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full border rounded-md p-2 h-24"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    style={{backgroundColor: '#3333FF',}}
                >
                    {loading ? "Updating..." : "Save Changes"}
                </button>

                {/* Success/Error Message */}
                {message && <p className="text-center text-sm mt-2">{message}</p>}
            </form>
        </div>
    );
};

export default Settings;
