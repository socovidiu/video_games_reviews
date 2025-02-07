const { Game, GameDetails, GameImage, GameReview } = require('../models/game');
const { fetchGamesList } = require('../services/rawgService');


// Get all games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [
        {
          model: GameImage,
          as: 'gameimage',
          attributes: ['imageUrl'],
        },
      ],
    });

    // Transform the response
    const transformedGames = games.map(game => ({
      gameData: {
        id: game.id,
        title: game.title,
        slug: game.slug,
        genre: game.genre,
        rating: game.rating,
        released: game.released,
      },
      gameImages: game.gameimage, // Assuming gameimage is already an array
    }));

    res.status(200).json(transformedGames);
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


// Get game details by ID
const getGameDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the game with associated reviews
    const game = await Game.findOne({
      where: { id },
      include: [
        {
          model: GameDetails,
          as: 'gamedetals', // Ensure this alias matches the one defined in associations
          attributes: ['description', 'platforms'],
        },
        {
          model: GameReview,
          as: 'reviews', // Ensure this alias matches the one defined in associations
          attributes: ['id', 'userId', 'username', 'comment', 'rating', 'createdAt'],
        },
        {
          model: GameImage,
          as: 'gameimage', // Ensure this alias matches the one defined in associations
          attributes: ['imageUrl'],
        },
      ],
    });

  
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Transform the response
    const transformedGame = {
      gameData: {
        id: game.id,
        title: game.title,
        slug: game.slug,
        genre: game.genre,
        rating: game.rating,
        released: game.released,
      },
      gameDetails: game.gamedetals,
      gameReviews: game.reviews,   //Assuming reviews is already an array
      gameImages: game.gameimage, // Assuming gameimage is already an array
    };
    console.debug("game data: ", transformedGame)
    res.status(200).json(transformedGame);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ message: 'Failed to fetch game details' });
  }
};

module.exports = { getAllGames, addGame, getGameDetails };
