import React, { useState, useEffect } from 'react';
import { fetchGames, FetchGameData } from '../services/api';
import GameCard from '../components/GameCard';
import { useLocation } from 'react-router-dom';

const HomePage: React.FC = () => {

  const [games, setGames] = useState<FetchGameData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and sorting states
  const [sortOrder, setSortOrder] = useState<string>('title'); 

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames();
        console.log('Fetched games:', data); // Debug the structure
        if (data && Array.isArray(data)) {
          setGames(data);
        }
      } catch (error) {
        setError('Failed to load games');
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  useEffect(() => {
    console.log("Fetched games (Type Check):", typeof games);
    console.log("Is games an array?", Array.isArray(games));
    console.table(games);
  }, [games]);

  // Extract search query from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || '';

  // Filter games based on search query
  const filteredGames = games.filter(game =>
      game.gameData?.title.toLowerCase().includes(searchQuery)
  );


  //  Sort the filtered list
  const sortedGames = [...filteredGames].sort((a, b) => {
    if (!a.gameData || !b.gameData) return 0;

    switch (sortOrder) {
      case 'title':
        return a.gameData.title.localeCompare(b.gameData.title);
      case 'rating':
        return (b.gameData.rating || 0) - (a.gameData.rating || 0);
      case 'released':
        return new Date(b.gameData.released).getTime() - new Date(a.gameData.released).getTime();
      default:
        return 0;
    }
  });

 

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>{error}</p>;
  if (!games || !games?.length){
    return <p>No games available.</p>;
  } 
  if (!sortedGames.length) return <p>No games found for "{searchQuery}"</p>;

  

  return (
    
    <div className="container ">
      <h1 className="text-3xl font-bold my-4">Video Game Reviews</h1>

      {/* Sorting Dropdown */}
      <div className="mb-4 text-left">
        <label className="mr-2 font-semibold">Sort by:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="title">Title (A-Z)</option>
          <option value="rating">Rating (Highest First)</option>
          <option value="released">Release Date (Newest First)</option>
        </select>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedGames.map((game) => (
           game.gameData && game.gameImages ? (
          <GameCard 
           key={game.gameData.id}
           gameData={game.gameData}
           gameImages={game.gameImages} />
          ) : (
            <div key={Math.random()} className="text-gray-500">Invalid game data</div>
          )
        ))}
      </div>
    </div>
  );
};

export default HomePage;