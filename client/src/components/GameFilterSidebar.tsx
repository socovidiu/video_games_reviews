import React from "react";

interface GameFilterSidebarProps {
  genre: string;
  setGenre: (genre: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const GameFilterSidebar: React.FC<GameFilterSidebarProps> = ({ genre, setGenre, sortOrder, setSortOrder }) => {
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
