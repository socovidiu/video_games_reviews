import React, { useState, useEffect } from 'react';
import { fetchGames, FetchGameData } from '../services/api';
import GameCard from '../components/GameCard';

const HomePage: React.FC = () => {

  const [games, setGames] = useState<FetchGameData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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


  if (loading) return <p>Loading games...</p>;
  if (error) return <p>{error}</p>;
  if (!games || !games?.length){
    return <p>No games available.</p>;
  } 
  

  return (
    
    <div className="container ">
      <h1 className="text-3xl font-bold my-4">Video Game Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
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