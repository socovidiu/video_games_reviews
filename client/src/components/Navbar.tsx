import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchGames, FetchGameData } from '../services/api';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [games, setGames] = useState<FetchGameData[]>([]);
    const [filteredGames, setFilteredGames] = useState<FetchGameData[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Ensure profilePicture is a string (handle File objects)
    const profilePictureSrc = user?.profilePicture instanceof File
    ? URL.createObjectURL(user.profilePicture): user?.profilePicture || "/Default_picture.jpg"; // Fallback image

    useEffect(() => {
        const loadGames = async () => {
            try {
                const data = await fetchGames();
                if (Array.isArray(data)) {
                    setGames(data);
                }
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };
        loadGames();
    }, []);

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        if (query.length > 0) {
            const suggestions = games.filter(game =>
                game.gameData?.title.toLowerCase().includes(query)
            );
            setFilteredGames(suggestions);
        } else {
            setFilteredGames([]);
        }
    };

    // Handle search submission
    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
            setFilteredGames([]);
        }
    };

    // Handle clicking a suggestion
    const handleSuggestionClick = (title: string) => {
        setSearchQuery(title);
        navigate(`/?search=${title}`);
        setFilteredGames([]);
    };

    // Handle clearing the search
    const handleClearSearch = () => {
        setSearchQuery("");
        setFilteredGames([]);
        navigate("/")
    };

    return (
        <div className="fixed inset-x-0 top-0 z-10 border-b border-gray-950/5 dark:border-white/10">
            <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Left-side navigation */}
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="hover:text-gray-300">
                                🎮 GameHub
                            </Link>
                        </li>
                    </ul>

                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="p-2 rounded-l-md border border-gray-700 bg-gray-900 text-white focus:outline-none w-3xl"
                        />
                        
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="ml-2 p-2 rounded"
                        >
                            🔍
                        </button>

                        {filteredGames.length > 0 && (
                            <ul className="absolute bg-white text-black w-full mt-1 border rounded shadow-lg max-h-40 overflow-y-auto">
                                {filteredGames.map(game => (
                                    <li
                                        key={game.gameData.id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleSuggestionClick(game.gameData.title)}
                                    >
                                        {game.gameData.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>

                    {/* Right: Authentication */}
                    <div 
                        className="relative"
                        onClick={()=> setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {isAuthenticated && user ? (
                            <div className="flex items-center cursor-pointer">
                                {/* Profile Image  & Dropdown Wrapper*/}
                                    {/* Profile Image */}
                                    <div className="flex items-center space-x-2">
                                    <img
                                        src={profilePictureSrc}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border border-gray-500"
                                    />
                                    <span className="ml-2 font-semibold text-left">{user.username}</span>
                                    </div>
                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute  mt-2 w-68 bg-white text-black shadow-lg rounded-lg overflow-hidden z-50 top-full">
                                        <div className="p-4 border-b">
                                            <div className="flex items-center space-x-3">
                                                <img src={profilePictureSrc} alt="Profile" className="w-12 h-12 rounded-full border" />
                                                <div>
                                                    <p className="font-semibold text-left">{user.username}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="py-2">
                                            <li>
                                                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-200">
                                                    Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={logout}
                                                    className="w-full px-4 py-2 hover:bg-red-500 hover:text-white"
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 text-black">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
