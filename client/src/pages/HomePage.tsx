import React, { useState, useEffect } from 'react';
import { fetchGames } from '../services/api';
import GameCard from '../components/GameCard';
import {Game} from "../types/Game"

const HomePage: React.FC = () => {

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames();
        console.log('Fetched games:', data); // Debug the structure
        setGames(data);
      } catch (error) {
        setError('Failed to load games');
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

 


  if (loading) return <p>Loading games...</p>;
  if (error) return <p>{error}</p>;
  if (!games?.length){
    return <p>No games available.</p>;
  } 
  else{
    console.log(games);

  }

  return (
    
    <div className="container ">
      <h1 className="text-3xl font-bold my-4">Video Game Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;