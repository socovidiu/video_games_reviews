import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {

    const  {logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="fixed inset-x-0 top-0 z-10 border-b border-gray-950/5 dark:border-white/10">
        <nav className=" bg-gray-800 text-white p-4 ">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left-side navigation */}
                <ul className="flex space-x-4">
                    <li>
                    <Link to="/" className="hover:text-gray-300">
                        Games
                    </Link>     
                    </li>
                </ul>
                {/* Right-side navigation */}
                <ul className="flex space-x-4">
                    <li>
                    <Link to="/login" className="hover:text-gray-300">
                        Login
                    </Link>
                    </li>
                    <li>
                    <Link to="/dashboard" className="hover:text-gray-300">
                        Dashboard
                    </Link>
                    </li>
                    <li>
                    <Link to="/" className="hover:text-gray-300"
                        onClick={handleLogout}>
                        Logout
                    </Link>
                    </li>
                </ul>
            </div>
        </nav>
        </div>
    );
};

export default Navbar;
