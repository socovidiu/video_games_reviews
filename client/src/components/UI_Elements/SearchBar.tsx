import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchGames, FetchGameData } from '../../services/api';


const SearchBar: React.FC = () => {

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
        setSearchQuery("");
    };

    // Handle clicking a suggestion
    const handleSuggestionClick = (title: string) => {
        navigate(`/?search=${title}`);
        setFilteredGames([]);
        setSearchQuery("");
    };


    return (
        <form onSubmit={handleSearchSubmit} className="relative w-2xl">
             {/* Search Icon */}
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
            </span>
            <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-600 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            
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
    );
};


export default SearchBar;