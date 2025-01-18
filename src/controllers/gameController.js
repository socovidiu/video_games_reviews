const { Game } = require('../models');

// Get all games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

// Add a new game
const addGame = async (req, res) => {
  try {
    const { title, genre, rating, review } = req.body;
    const newGame = await Game.create({ title, genre, rating, review });
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add game' });
  }
};

module.exports = { getAllGames, addGame };
