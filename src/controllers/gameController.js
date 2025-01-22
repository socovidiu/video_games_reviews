const { Game, GameDetails, GameImage, GameReview, User  } = require('../models/game');
const { fetchGamesList } = require('../services/rawgService');


// Get all games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// Add a new game
async function addGame(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Game name is required' });
  }
  try {
    const gameData = await fetchGamesList(name);
    
    // Save to database
    await Game.upsert({
      id: gameData.id,
      title: gameData.name,
      slug: gameData.slug,
      genre: gameData.genres.map((g) => g.name).join(', '),
      rating: gameData.rating,
      released: gameData.released,
    });

    await GameDetails.upsert({
      gameId: gameData.id,
      description: gameData.description_raw,
      platforms: gameData.platforms.map((p) => p.platform.name).join(', '),
    });
    // Add the cover photo
    if (gameData.background_image) {
      await GameImage.upsert({
        gameId: gameData.id,
        imageUrl: gameData.background_image,
        type: 'cover', // Tagging this as the cover image
      });
    }

    console.debug(gameData,name ,"was added to the database")
    res.status(201).json({ message: 'Game added successfully', game: gameData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = { getAllGames, addGame };
