// Create a Service to Fetch Game Details
const axios = require('axios');
const { Game, GameDetails, GameImage } = require('../models/game');

const RAWG_API_BASE_URL = 'https://api.rawg.io/api';

// Fetch a list of games by name
const fetchGamesList = async (gameName) => {
  try {
    const response = await axios.get(`${RAWG_API_BASE_URL}/games`, {
      params: {
        key: process.env.RAWG_API_KEY,
        search: gameName,
        page_size:1,
      },
    });
    console.debug("Data is fetched", response.data);
    // Get the first game ID from the results
    const gameId = response.data.results[0]?.id; 
    if (!gameId) throw new Error('Game not found for the provided name');
   
    // Fetch and add game details
    const gameDetails = await fetchGameById(gameId);
    return gameDetails; // Return the full game details

  } catch (error) {
    console.error('Error fetching game list:', error.message);
    throw new Error('Failed to fetch game list');
  }
};

const fetchGameById = async (id) => {
  try {
  
    const response = await axios.get(`${RAWG_API_BASE_URL}/games/${id}`, {
      params: { key: process.env.RAWG_API_KEY },
    });
    console.debug("Data is fetched", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error.message);
    throw new Error('Failed to fetch game details');
  }
};



module.exports = { fetchGamesList, fetchGameById };
