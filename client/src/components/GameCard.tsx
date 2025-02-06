import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types/Game';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const imageUrl = game.gameimage[0]?.imageUrl; // Access the first image URL safely

  return (
    <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition">
      <img src={imageUrl} alt={game.title} className="w-full h-48 object-cover rounded-md" />
      <h2 className="text-xl font-semibold mt-2">{game.title}</h2>
      <p className="text-gray-500">{game.genre}</p>
      <p className="text-yellow-500">⭐ {game.rating}/5</p>
      <Link to={`/games/${game.id}`} className="text-blue-500 hover:underline mt-2 block">
        View Details
      </Link>
    </div>
  );
};

export default GameCard;