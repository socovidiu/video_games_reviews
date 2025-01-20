// Create a Service to Fetch Game Details
const axios = require('axios');
const RAWG_API_BASE_URL = 'https://api.rawg.io/api';


const fetchGameDetails = async (gameName) => {
  try {
    const response = await axios.get(`${RAWG_API_BASE_URL}/games`, {
      params: {
        key: process.env.RAWG_API_KEY,
        search: gameName,
      },
    });
    console.debug("Data is fetched", response.data);
    return response.data; // RAWG returns a list of results
  } catch (error) {
    console.error('Error fetching game details:', error.message);
    throw new Error('Failed to fetch game details');
  }
};

module.exports = { fetchGameDetails };
