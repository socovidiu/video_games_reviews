import React, { useState, useRef  } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from './UI_Elements/SearchBar'
import Dropdown from './UI_Elements/Dropdown'
import Button from './UI_Elements/Button'

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileButtonRef = useRef<HTMLDivElement>(null);
  // Ensure profilePicture is a string (handle File objects)
  const profilePictureSrc = user?.profilePicture instanceof File
  ? URL.createObjectURL(user.profilePicture): user?.profilePicture || "/Default_picture.jpg"; // Fallback image
  
  return (
      <section className="fixed top-0 z-10 w-full bg-gray-600 px-4 py-2">
          <div className="w-auto mx-auto flex justify-between items-center">
                <Link to="/" className="px-4 py-2 rounded-lg text-black hover:text-gray-700">
                    🎮 GameHub
                </Link>

                <SearchBar/>

                <div 
                    className="relative pr-8"
                    ref={profileButtonRef} // Attach ref to the button wrapper
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {isAuthenticated && user ? (
                        <div className="flex items-center cursor-pointer">
                            <img src={profilePictureSrc} alt="Profile" className="w-10 h-10 rounded-full border border-gray-500" />
                            <span className="ml-2 font-semibold text-left text-white">{user.username}</span>
                        </div>
                    ) : (
                        <Link to="/login" className="bg-gray-400 px-4 py-2 rounded-lg hover:bg-gray-200 text-black">
                            Login
                        </Link>
                    )}
                </div>

                <Dropdown isOpen={isDropdownOpen} anchorRef={profileButtonRef}>
                    <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                            <img src={profilePictureSrc} alt="Profile" className="w-12 h-12 rounded-full border" />
                            <div>
                                <p className="font-semibold text-left">{user?.username}</p>
                                <p className="text-sm text-gray-500 break-words w-full text-left">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                    <ul className="py-2">
                        <li><Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">Dashboard</Link></li>
                        <li><Link to="/settings" className="block px-4 py-2 hover:bg-gray-200">Settings</Link></li>
                        <li><Button onClick={logout} className="w-full hover:bg-red-500 hover:text-white">Logout</Button></li>
                    </ul>
                </Dropdown>
          </div>
      </section>
  );
};


export default Navbar;
