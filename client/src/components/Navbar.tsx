import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchGames, FetchGameData } from '../services/api';


const Navbar: React.FC = () => {

    const  {logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [games, setGames] = useState<FetchGameData[]>([]);
    const [filteredGames, setFilteredGames] = useState<FetchGameData[]>([]);

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


    const handleLogout = () => {
        logout();
    };

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
            setFilteredGames([]); // Hide suggestions after search
        }
    };

    // Handle clicking a suggestion
    const handleSuggestionClick = (title: string) => {
        setSearchQuery(title);
        navigate(`/?search=${title}`);
        setFilteredGames([]); // Hide suggestions after clicking
    };

    // Handle clearing the search
    const handleClearSearch = () => {
        setSearchQuery("");  // Clear input field
        setFilteredGames([]);  // Clear suggestions
        navigate("/")
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
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="p-2 rounded-l-md border border-gray-700 bg-gray-900 text-white focus:outline-none w-3xl"
                    />
                    {/* Show clear button only if searchQuery is not empty */}
                    
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
