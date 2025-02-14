import React, { useState, useEffect } from 'react';
import { fetchGames, FetchGameData } from '../services/api';
import GameCard from '../components/GameCard';
import GameFilterSidebar from '../components/FilterSidebar';
import { useLocation } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [games, setGames] = useState<FetchGameData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [genre, setGenre] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('title'); 
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRating, setMaxRating] = useState<number>(5);
  const [releaseYear, setReleaseYear] = useState<string>("");

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames();
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

  // Extract search query from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  // **🔹 Apply Filters: Genre + Search Query + Rating + Release Year**
  const filteredGames = games.filter(game => {
    const matchesGenre = !genre || game.gameData?.genre.toLowerCase().includes(genre.toLowerCase());
    const matchesSearch = !searchQuery || game.gameData?.title.toLowerCase().includes(searchQuery);
    const matchesRating = 
      (game.gameData.rating || 0) >= minRating &&
      (game.gameData.rating || 0) <= maxRating;
    const matchesReleaseYear = 
      !releaseYear || 
      (game.gameData.released && new Date(game.gameData.released).getFullYear().toString() === releaseYear);

    return matchesGenre && matchesSearch && matchesRating && matchesReleaseYear;
  });

  // **🔹 Apply Sorting**
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
  
  return (
    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">

      {/* Left Sidebar */}
      <GameFilterSidebar 
      genre={genre} 
      setGenre={setGenre} 
      sortOrder={sortOrder} 
      setSortOrder={setSortOrder} 
      minRating={minRating}
      setMinRating={setMinRating}
      maxRating={maxRating}
      setMaxRating={setMaxRating}
      releaseYear={releaseYear}
      setReleaseYear={setReleaseYear}
      />

      {/* Right Content */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">🎮 Video Game List</h1>

       {/* Game Cards Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       {sortedGames.length > 0 ? (
          sortedGames.map((game) =>
            game.gameData && game.gameImages ? (
              <GameCard
                key={game.gameData.id}
                gameData={game.gameData}
                gameImages={game.gameImages}
              />
            ) : (
              <div key={Math.random()} className="text-gray-500">Invalid game data</div>
            )
          )
          ) : (
            // No games found message, but filters stay visible
            <div className="col-span-full text-center text-gray-600 text-lg p-4">
              <p>
                No games found
                {searchQuery ? ` matching "${searchQuery}"` : ""} 
                {genre ? ` in "${genre}" genre` : " in All Genres"}.
              </p>
              <p>Try adjusting your search or filter settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
