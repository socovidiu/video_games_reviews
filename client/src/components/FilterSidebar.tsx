import React from "react";

interface GameFilterSidebarProps {
  genre: string;
  setGenre: (genre: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  maxRating: number;
  setMaxRating: (rating: number) => void;
  releaseYear: string;
  setReleaseYear: (year: string) => void;
}

const GameFilterSidebar: React.FC<GameFilterSidebarProps> = ({
  genre, setGenre, 
  sortOrder, setSortOrder, 
  minRating, setMinRating, 
  maxRating, setMaxRating, 
  releaseYear, setReleaseYear
  }) => {
  return (
    <div className="w-full md:w-1/4 bg-white p-4 border rounded-lg shadow-md h-fit sticky top-20">
        <h2 className="text-xl font-semibold mb-4">🎮 Filter & Sort</h2>

      {/* Genre Filter */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Filter by Genre:</label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="RPG">RPG</option>
          <option value="Shooter">Shooter</option>
          <option value="Strategy">Strategy</option>
          <option value="Adventure">Adventure</option>
        </select>
      </div>

       {/* Rating Range Filter */}
       <div className="mb-4">
        <label className="block font-semibold mb-1">Rating Range:</label>
        <div className="flex justify-between text-sm text-gray-700">
          <span>{minRating}</span>
          <span>{maxRating}</span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={minRating}
          onChange={(e) => setMinRating(parseFloat(e.target.value))}
          className="w-full"
        />
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={maxRating}
          onChange={(e) => setMaxRating(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Release Year Filter */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Release Year:</label>
        <select
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          className="w-full p-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Any Year</option>
          {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year.toString()}>{year}</option>
          ))}
        </select>
      </div>


      {/* Sorting Options */}
      <div>
        <label className="block font-semibold mb-1">Sort by:</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full p-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="title">Title (A-Z)</option>
          <option value="rating">Rating (Highest First)</option>
          <option value="released">Release Date (Newest First)</option>
        </select>
      </div>
    </div>
  );
};

export default GameFilterSidebar;
