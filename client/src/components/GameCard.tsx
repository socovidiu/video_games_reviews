import React from 'react';
import { Link } from 'react-router-dom';
import { FetchGameData } from '../services/api';



const GameCard: React.FC<FetchGameData> = ({ gameData, gameImages }) => {
  
  if (!gameData) {
    return <div className="text-gray-500">Game data unavailable</div>;
  }
  const imageUrl = gameImages[0]?.imageUrl; // Access the first image URL safely

  return (
    <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition">
      <img src={imageUrl} alt={gameData.title} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{gameData.title}</h2>
      <p className="text-gray-500">{gameData.genre}</p>
      <p className="text-yellow-500">⭐ {gameData.rating}/5</p>
      <Link to={`/games/${gameData.id}`} className="text-blue-500 hover:underline mt-2 block">
        View Details
      </Link>
    </div>
  );
};

export default GameCard;